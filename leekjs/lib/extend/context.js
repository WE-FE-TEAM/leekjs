/**
 * 扩展 koa.Context 对象
 * Created by Jess on 2018/5/23.
 */

'use strict';

const leek = global.leek;

const SERVICE_MAP = Symbol('leek:context:serviceMap');

module.exports = {

    getConfig(module, key){
        return leek.getConfig(module, key);
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
    }
};