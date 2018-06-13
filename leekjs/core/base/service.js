/**
 * service 基类
 * Created by Jess on 2018/5/25.
 */

'use strict';

const delegates = require('delegates');

class Service {

    constructor(ctx){
        this.ctx = ctx;
    }
}


delegates(Service.prototype, 'ctx')
    .getter('log')
    .method('getConfig')
    .method('assign')
    .method('callService')
    .method('curl');


module.exports = Service;

