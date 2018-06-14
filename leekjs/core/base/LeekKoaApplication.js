/**
 * 继承自 KoaApplication
 * Created by Jess on 2018/5/23.
 */

'use strict';

const KoaApplication = require('koa');
const bunyan = require('bunyan');
const fse = require('fs-extra');
const urllib = require('urllib');

const LOGGER_SYMBOL = Symbol('leek:koa:app:logger');


class LeekKoaApplication extends KoaApplication{

    getConfig( key, module){
        return leek.getConfig( key, module);
    }

    get log(){
        if( ! this[LOGGER_SYMBOL] ){
            //读取配置
            const conf = this.getConfig('log');
            const streams = conf.streams || [];
            //如果有输出日志到文件，先确保文件存在
            streams.forEach( (obj) => {
                if( obj.path ){
                    //日志需要输出到文件
                    fse.ensureFileSync(obj.path);
                }
            });

            // if( ! conf || ! conf.name ){
            //     //配置错误
            //     throw new Error(``);
            // }
            this[LOGGER_SYMBOL] = bunyan.createLogger(conf);
        }
        return this[LOGGER_SYMBOL];
    }

    /**
     * 发起http请求
     * 参数文档：https://github.com/node-modules/urllib#method-httprequesturl-options-callback
     * @param url {string | object} 请求的URL
     * @param options {object?} 请求的一些配置参数
     * @param callback {Function?} 回调
     * @returns {Promise.<*>}
     */
    async curl(url, options, callback){
        return urllib.request(url, options, callback);
    }
}



module.exports = LeekKoaApplication;

