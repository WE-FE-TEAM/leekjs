/**
 *
 * Created by Jess on 2018/5/23.
 */

'use strict';

const querystring = require('querystring');
const fg = require('fast-glob');
const _ = require('lodash');
const debug = require('debug')('leek:util');


/**
 * 自定义的配置合并过程，如果值是数组，则直接覆盖
 * @param objValue
 * @param srcValue
 * @returns {*}
 */
function mergeHandle(objValue, srcValue){
    if (_.isArray(srcValue)) {
        return srcValue;
    }
}

let util = {

    /**
     * 深度拷贝merge，
     * 如果同名的value是object，则递归merge
     * 如果是其他类型，则直接覆盖
     * @param to {object} 要覆盖的对象
     * @param from {object} 读取的对象
     * @returns {object} merge之后的对象，也就是 out
     */
    deepMergeObject(to, from){
        _.mergeWith(to, from, mergeHandle);
        return to;
    },

    /**
     * 查找某个目录下，满足某种GLOB模式的文件，返回所有文件列表
     * @param baseDir {string} 基础目录
     * @param pattern {Array|string} 模式数组
     * @param options {object?} 传给 fast-glob 的配置
     * @returns {Array} 匹配的文件路径列表
     */
    findFiles(baseDir, pattern, options){
        let out = [];

        if(typeof pattern === 'string'){
            pattern = [ `${baseDir}${pattern}` ];
        }else{
            pattern = pattern.map( (obj) => {
                return `${baseDir}${obj}`;
            });
        }

        out = fg.sync(pattern, options);

        return out;
    },

    /**
     * 加载配置文件数组中的文件，merge成一个配置，数组中靠后的同名配置项会覆盖前面的
     * @param confArray {Array} 要加载的文件列表
     * @returns {{}}
     */
    mergeConfigFiles(confArray){
        let out = {};

        confArray.forEach( (file) => {
            let conf = require(file);
            _.mergeWith(out, conf, mergeHandle);
        });

        return out;
    },

    /**
     * 读取一些列的extend文件定义，扩展到 proto 对象上
     * 代码来自阿里 egg.js ，有修改
     * @param proto {object} 要扩展的原型对象
     * @param protoFileList {Array} 要加载的扩展JS文件路径列表
     * @param extendName {string} 要扩展的原型名，比如 request/response/context/application/controller 等
     * @param app {Application} koa application 实例
     */
    mergePrototype(proto, protoFileList, extendName, app){

        const mergeRecord = new Map();

        protoFileList.forEach( (filePath) => {

            let ext = {};

            let obj = require(filePath);

            if( _.isPlainObject(obj) ){
                ext = obj;
            }else if( _.isFunction(obj) ){
                ext = obj(app);
            }else{
                //应该有问题了，只能export上面两种：纯对象或者函数
                throw new Error(`文件export不合法，只能是function或object: ${filePath}`);
            }

            const properties = Object.getOwnPropertyNames(ext)
                .concat(Object.getOwnPropertySymbols(ext));

            for (const property of properties) {
                if (mergeRecord.has(property)) {
                    debug('Property: "%s" already exists in "%s"，it will be redefined by "%s"',
                        property, mergeRecord.get(property), filePath);
                }

                // Copy descriptor
                let descriptor = Object.getOwnPropertyDescriptor(ext, property);
                let originalDescriptor = Object.getOwnPropertyDescriptor(proto, property);

                if (originalDescriptor) {
                    // don't override descriptor
                    descriptor = Object.assign({}, descriptor);
                    if (!descriptor.set && originalDescriptor.set) {
                        descriptor.set = originalDescriptor.set;
                    }
                    if (!descriptor.get && originalDescriptor.get) {
                        descriptor.get = originalDescriptor.get;
                    }
                }
                Object.defineProperty(proto, property, descriptor);
                mergeRecord.set(property, filePath);
            }
            debug('merge %j to %s from %s', Object.keys(ext), extendName, filePath);
        });
    },

    /**
     * 遍历 rewrite 数组，根据匹配到的规则，对URL进行重写
     * 主要参考 thinkjs 的实现： https://github.com/thinkjs/think-router/blob/master/router.js
     * @param ctx {Context}
     * @param rules {Array} rewrite 数组
     * @returns {*}
     */
    matchRule(ctx, rules){
        //匹配的规则
        let matchedRule = null;
        let originPath = ctx.path || '/';
        let rewritePath = ctx.rewritePath;
        const params = {};

        rules.some( (rule) => {
            let out = rule.match.exec(rewritePath);
            if( ! out ){
                return;
            }
            rewritePath = rule.rewrite;

            const keys = rule.keys;
            keys.forEach( (key, index) => {
                const name = key.name;
                if( rule.isStringMatch ){
                    //原始match配置的是string
                    params[name] = out[ index + 1];
                    rewritePath = rewritePath.replace(new RegExp(`:${name}`, 'g'), params[name]);
                }else{
                    //原始配置的是正则
                    const keyIndex = parseInt(name, 10) + 1;
                    rewritePath = rewritePath.replace(new RegExp(`\\$${keyIndex}`, 'g'), out[keyIndex] || '');
                }

            });

            matchedRule = rule;

            return true;

        });

        //这里先允许用户在rewrite中配置query部分吧，后面解析controller的时候，还会对query部分进行解析，并覆盖到 ctx.query 上
        //去掉rewrite之后，可能包含的query部分
        // let index = rewritePath.indexOf('?');
        // if( index >= 0 ){
        //     rewritePath = rewritePath.substring(0, index);
        // }

        //记录下rewrite之后的路径
        ctx.rewritePath = rewritePath;

        // if( ! ctx.params ){
        //     ctx.params = {};
        // }
        Object.assign(ctx.params, params);

        if( matchedRule && matchedRule.overrideQuery ){
            Object.assign(ctx.query, params);
        }


        return matchedRule;
    },

    /**
     * 根据当前请求的 rewritePath，找出对应的 module、controller、action。
     * 如果 rewritePath 中包含多余的路径和query，都会合并到 ctx.query 中
     * @param ctx {Context}
     * @param controllerMap {Map} controller map
     * @returns {{module: *, controller: *, controllerClass: *, action: *}}
     */
    parseController(ctx, controllerMap){

        let module = null;
        let controllerKey = null;
        let controllerClass = null;
        let action = null;
        let controllerPath = null;

        let path = (ctx.rewritePath || '').replace(/^\/+/, '');
        //去掉可能包含的 #hash
        let hashPos = path.indexOf('#');
        if( hashPos >= 0 ){
            path = path.substring(0, hashPos);
        }

        for(let name of controllerMap.keys() ){
            if( name === path || path.indexOf(`${name}/`) === 0 ){
                //找到对应的controller
                controllerPath = name;
                controllerClass = controllerMap.get(name);
                break;
            }
        }

        if( controllerPath ){
            let arr = controllerPath.split('/');
            module = arr.shift();
            controllerKey = arr.join('/');

            let actionPath = path.replace(`${controllerPath}`, '');
            if( actionPath[0] === '/' ){
                actionPath = actionPath.replace(/^\/+/, '');
            }

            //去掉可能包含的 ?query
            let queryPos = actionPath.indexOf('?');
            if( queryPos >= 0 ){
                actionPath = actionPath.substring(0, queryPos);
            }

            let query = {};

            if( ! actionPath ){
                //默认的action
                action = 'index';
            }else{
                let fragArray = actionPath.split('/');
                if( fragArray.length > 1 ){
                    action = fragArray.shift();
                    //剩余的path中，作为 query 来解析： k1/v1/k2/v2
                    for( let i = 0, len = fragArray.length - 1; i < len; i += 2 ){
                        try{
                            query[ fragArray[i] ] = decodeURIComponent( fragArray[i + 1] );
                        }catch(e){

                        }
                    }
                }else{
                    //应该直接取action，没有通过 / 分隔的参数
                    action = actionPath;
                }

            }

            //经过 rewrite 之后，path中可能还包含 ?k1=v1&k2=v2
            let pos = path.indexOf('?');
            if( pos >= 0 ){
                Object.assign(query, querystring.parse(path.substring(pos + 1)));
            }

            //覆盖 ctx.query
            Object.assign(ctx.query, query);
        }

        if( action ){
            const urlBeautify = leek.getConfig('urlBeautify') || {};
            if( urlBeautify.action ){
                //用户配置了action URL美化，需要把 action 转换成 camelCase 格式的
                action = _.camelCase(action);
            }
        }


        return {
            module: module,
            controller: controllerKey,
            controllerClass: controllerClass,
            action: action
        };
    },

};



module.exports = util;

