/**
 * policy 基类
 * Created by Jess on 2018/5/25.
 */

'use strict';

const delegates = require('delegates');

class Policy {

    constructor(ctx){
        this.ctx = ctx;
    }

    async execute(args){
        throw new Error(`Policy必须覆盖基类的  execute 方法！`);
    }
}


module.exports = Policy;

