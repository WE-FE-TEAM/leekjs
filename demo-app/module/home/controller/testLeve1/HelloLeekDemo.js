/**
 *
 * Created by Jess on 2018/6/8.
 */

'use strict';

class HelloLeekDemo extends leek.Controller{


    async some2MutiWordQueryAction(){
        this.ctx.body = {
            status: 1000,
            message: '嵌套的多层controller，URL优化测试',
            query: this.ctx.query
        };
    }
}


module.exports = HelloLeekDemo;

