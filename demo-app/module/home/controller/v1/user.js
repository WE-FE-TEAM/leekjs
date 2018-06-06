/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';

const Controller = leek.Controller;

class UserController extends Controller{

    //默认的action
    async indexAction(){
        this.ctx.body = 'hello indexAction from User';
    }

    async infoAction(){
        const {ctx} = this;
        ctx.body = {
            isLogin: 'unknown',
            user: ctx.user,
            query: ctx.query
        };
    }

    async test2Action(){
        this.ctx.body = {
            hello: 'policy',
            noUser: this.ctx.user
        };
    }
}


module.exports = UserController;


