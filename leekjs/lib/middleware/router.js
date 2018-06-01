/**
 * 负责根据用户配置的 systemConfig.rewrite ，决定是否进行rewrite。
 * 然后根据rewrite之后的URL，匹配要执行的 module/controller/action
 * 主要参考 thinkjs 的实现： https://github.com/thinkjs/think-router/blob/master/router.js
 * Created by Jess on 2018/5/25.
 */

'use strict';

const _ = require('lodash');
const path2reg = require('path-to-regexp');

/**
 * 遍历 rewrite 数组，根据匹配到的规则，对URL进行重写
 * @param ctx {Context}
 * @param rules {Array} rewrite 数组
 * @returns {*}
 */
function matchRule(ctx, rules){
    //匹配的规则
    let matchedRule = null;
    let originPath = ctx.path || '/';
    let rewritePath = originPath;
    const params = {};

    rules.some( (rule) => {
        let out = rule.match.exec(originPath);
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
                rewritePath = rewritePath.replace(new RegExp(`\\$${index}`, 'g'), out[keyIndex] || '');
            }

        });

        matchedRule = rule;

        return true;

    });

    //去掉rewrite之后，可能包含的query部分
    let index = rewritePath.indexOf('?');
    if( index >= 0 ){
        rewritePath = rewritePath.substring(0, index);
    }

    //记录下rewrite之后的路径
    ctx.rewritePath = rewritePath;

    if( ! ctx.params ){
        ctx.params = {};
    }
    Object.assign(ctx.params, params);

    if( matchedRule && matchedRule.overrideQuery ){
        Object.assign(ctx.query, params);
    }


    return matchedRule;
}


function parseController(ctx, controllerMap){

    let module = null;
    let controllerClass = null;
    let action = null;
    let controllerPath = null;

    const path = ctx.rewritePath || '/';
    let keys = controllerMap.keys();
    for(let i = 0; i < keys.length; i++ ){
        let name = keys[i];
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
        let actionPath = path.replace(`${controllerPath}/`, '');
        if( ! actionPath ){
            //默认的action
            action = 'index';
        }else{
            let fragArray = actionPath.split('/');
            action = fragArray.shift();
            //剩余的path中，作为 query 来解析： k1/v1/k2/v2
            let query = ctx.query;
            for( var i = 0; i < fragArray.length; i += 2 ){
                try{
                    query[ fragArray[i] ] = decodeURIComponent( fragArray[i + 1] );
                }catch(e){

                }
            }
        }
    }


    return {
        module: module,
        controllerClass: controllerClass,
        action: action
    };
}

module.exports = function(options, app){

    options = options || {

    };

    const rewrite = app.getConfig('rewrite') || [];
    const rules = rewrite.map( (obj) => {
        const out = {
            rewrite: obj.rewrite
        };
        const keys = [];
        const reg = path2reg(obj.match, keys);
        out.match = reg;
        out.keys = keys;
        //原始的match配置，是string类型的
        out.isStringMatch = _.isString(obj.rewrite);
        out.overrideQuery = obj.overrideQuery !== false;

        return out;
    });

    return async function router(ctx, next){

    }
};


