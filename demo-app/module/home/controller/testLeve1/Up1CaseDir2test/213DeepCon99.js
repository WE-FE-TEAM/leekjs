/**
 *
 * Created by Jess on 2018/6/8.
 */

'use strict';


module.exports = class DemoController extends leek.Controller{

    async testBig3NumAction(){
        this.ctx.body = {
            query: this.ctx.query
        };
    }
};