/**
 *
 * Created by Jess on 2018/5/25.
 */

'use strict';


const leek = {
    systemConfig: {},
    moduleConfig: {},
    serviceMap: new Map(),

    getConfig(module, key){
        let conf = this.systemConfig;
        if( arguments.length === 2 ){
            conf = this.moduleConfig;
        }
        conf = conf[module] || {};
        return conf[key];
    },

    getServiceClass(serviceName){
        return this.serviceMap.get(serviceName);
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
