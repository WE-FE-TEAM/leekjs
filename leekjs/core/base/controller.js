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

    //提供一个async的初始化方法，允许在具体controller中，执行一些自定义初始化动作
    async init(){

    }
}


delegates(Controller.prototype, 'ctx')
    .getter('log')
    .method('getConfig')
    .method('assign')
    .method('callService');

module.exports = Controller;

