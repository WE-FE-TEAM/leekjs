/**
 *
 * Created by Jess on 2018/5/25.
 */

'use strict';


const leek = {
    systemConfig: {},
    moduleConfig: {},
    policyMap: new Map(),
    serviceMap: new Map(),

    /**
     * 只传key，读取 systemConfig。
     * 传key和module 2个参数时，读取 moduleConfig
     * @param module {string}
     * @param key {string}
     * @returns {*}
     */
    getConfig(key, module){
        let conf = this.systemConfig;
        if( module ){
            conf = this.moduleConfig;
            conf = conf[module] || {};
        }

        return conf[key];
    },

    getServiceClass(serviceName){
        return this.serviceMap.get(serviceName);
    },

    getPolicyClass(policyName){
        return this.policyMap.get(policyName);
    }
};

Object.defineProperty(global, 'leek', {
    value: leek,
    writable: false
});

const LeekApp = require('./LeekApp.js');
const Policy = require('./base/policy.js');
const Service = require('./base/service.js');
const Controller = require('./base/controller.js');




Object.defineProperty(leek, 'LeekApp', {
    value: LeekApp,
    writable: false
});

Object.defineProperty(leek, 'Policy', {
    value: Policy,
    writable: false
});

Object.defineProperty(leek, 'Service', {
    value: Service,
    writable: false
});

Object.defineProperty(leek, 'Controller', {
    value: Controller,
    writable: false
});


module.exports = leek;
