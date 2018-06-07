/**
 * controller 基类
 * Created by Jess on 2018/5/25.
 */

'use strict';

const delegates = require('delegates');

class Controller {

    constructor(ctx){
        this.ctx = ctx;
    }
}


delegates(Controller.prototype, 'ctx')
    .getter('log')
    .method('getConfig')
    .method('assign')
    .method('request');

module.exports = Controller;

