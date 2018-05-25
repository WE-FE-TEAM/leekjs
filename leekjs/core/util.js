/**
 *
 * Created by Jess on 2018/5/23.
 */

'use strict';

const fg = require('fast-glob');
const _ = require('lodash');


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
     * 查找某个目录下，满足某种GLOB模式的文件，返回所有文件列表
     * @param baseDir {string} 基础目录
     * @param pattern {Array|string} 模式数组
     * @returns {Array} 匹配的文件路径列表
     */
    findFiles(baseDir, pattern){
        let out = [];

        if(typeof pattern === 'string'){
            pattern = [ `${baseDir}${pattern}` ];
        }else{
            pattern = pattern.map( (obj) => {
                return `${baseDir}${obj}`;
            });
        }

        out = fg.sync(pattern);

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
    }
};



module.exports = util;

