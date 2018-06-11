/**
 * 扩展 koa.Context 对象
 * Created by Jess on 2018/5/23.
 */

'use strict';

const delegates = require('delegates');
const uuid = require('uuid');

const leek = global.leek;

const SERVICE_MAP = Symbol('leek:context:serviceMap');
const REWRITE_PATH = Symbol('leek:context:rewritePath');
const REQ_PARAMS = Symbol('leek:context:reqParams');
const CONTEXT_LOG = Symbol('leek:context:log');
const CONTEXT_REQ_ID = Symbol('leek:context:reqId');

//读取请求惟一ID的header字段
const contextLogConfig = leek.getConfig('contextLog');

const proto = {

    getConfig(key, module){
        return leek.getConfig( key, module);
    },

    /**
     * 给 context.state 赋值
     * @param key {string|object}
     * @param value {string?} 可选参数
     */
    assign(key, value){
        let data = key;
        if( arguments.length === 2 ){
            data = {
                [key]: value
            };
        }
        Object.assign(this.state, data);
    },

    get serviceMap(){
        if( this[SERVICE_MAP] ){
            return this[SERVICE_MAP];
        }
        return this[SERVICE_MAP] = new Map();
    },

    /**
     * 获取某个service的实例，会缓存已经初始化过的服务
     * @param serviceName {string} 服务名
     */
    getService(serviceName){
        let obj = this.serviceMap.get(serviceName);
        if( obj ){
            return obj;
        }
        const Class = leek.getServiceClass(serviceName);
        if( ! Class instanceof leek.Service ){
            throw new Error(`[${serviceName}]对应的service，必须是 leek.Service 的子类`);
        }
        obj = new Class(this);
        this.serviceMap.set(serviceName, obj);
        return obj;
    },

    /**
     * 调用某个服务的某个方法: 服务名和方法名，用 . 分隔，比如：
     * user.coupon.getUserCoupon  调用个是 lib/service/user/coupon.js 的 getUserCoupon 方法
     * @param serviceMethod {string} 服务名+方法名
     * @param args {Array} 参数
     * @returns {Promise.<*>}
     */
    async request(serviceMethod, ...args){
        const arr = serviceMethod.split('.');
        const methodName = arr.pop();
        const serviceName = arr.join('.');
        const service = this.getService(serviceName);
        return service[methodName].apply(service, args);
    },

    get rewritePath(){
        if( ! this[REWRITE_PATH] ){
            return this.path;
        }
        return this[REWRITE_PATH];
    },

    set rewritePath(path){
        this[REWRITE_PATH] = path;
    },

    get params(){
        if( ! this[REQ_PARAMS] ){
            this[REQ_PARAMS] = {};
        }
        return this[REQ_PARAMS];
    },

    set params(val){
        this[REQ_PARAMS] = val;
    },

    async e404(){
        this.status = 404;
    },

    async e500(err){
        this.log.error(err);
        this.status = 500;
    },

    get log(){
        if( ! this[CONTEXT_LOG] ){

            let conf = {
                original_url: this.originalUrl
            };

            if( this.reqId ){
                conf.req_id = this.reqId;
            }

            this[CONTEXT_LOG] = this.app.log.child(conf);
        }
        return this[CONTEXT_LOG];
    },

    get reqId(){
        if( ! this.hasOwnProperty(CONTEXT_REQ_ID) ){
            let reqId = this.header[contextLogConfig.reqIdHeader];
            if( ! reqId && contextLogConfig.generateReqId ){
                reqId = uuid.v4();
            }
            if( reqId ){
                this.set(contextLogConfig.reqIdHeader, reqId);
            }
            this[CONTEXT_REQ_ID] = reqId;
        }
        return this[CONTEXT_REQ_ID];
    }

};


// delegates(proto, 'request')
//     .getter('originalUrl');


module.exports = proto;


