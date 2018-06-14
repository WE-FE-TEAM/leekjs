/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';

const Controller = leek.Controller;

class PassportIndexController extends Controller{

    async helloAction(){
        this.ctx.body = {
            text: 'hello world. 来自 passport.index.hello',
            params: this.ctx.params,
            query: this.ctx.query,
            state: this.ctx.state,
            user: this.ctx.user
        };
    }

    async stateAction(){
        this.log.error(`出错啦`);
        this.log.info(`测试打日志功能[%s]`, 'hello');
        this.ctx.body = {
            status: 0,
            message: 'ok',
            data: {
                params: this.ctx.params,
                query: this.ctx.query,
                state: this.ctx.state
            }
        };
        this.log.warn('测试log里传JSON怎么样 %O', this.ctx.query);
    }

    async userInfoAction(){

        let data = await this.ctx.callService('user.v1.simple.getUserDetail', '111222333');

        this.ctx.body = {
            status: 0,
            message: 'ok',
            data: data
        };
    }

    async testJsonAction(){

        this.ctx.body = {
            cookies: this.ctx.req.headers.cookie,
            query: this.ctx.query
        };
    }

    async getLocalAction(){
        let data = await this.ctx.callService('user.v1.simple.requestLocal', {
            hello: 'jess',
            leek: 'NO'
        });

        this.ctx.body = {
            status: 0,
            message: 'ok',
            data: data
        };
    }
}

module.exports = PassportIndexController;

