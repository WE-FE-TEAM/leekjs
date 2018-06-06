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
            state: this.ctx.state
        };
    }

    async stateAction(){
        this.ctx.body = {
            status: 0,
            message: 'ok',
            data: {
                params: this.ctx.params,
                query: this.ctx.query,
                state: this.ctx.state
            }
        };
    }
}

module.exports = PassportIndexController;

