/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';


const Controller = leek.Controller;

class DemoController extends Controller{

    async testAction(){
        const client = this.ctx.clientInfo;
        console.log(`client: `, client);
        console.log(`params:`, this.ctx.params);
        console.log(`query:`, this.ctx.query);
        this.ctx.body = 'hello leekjs';
    }
}


module.exports = DemoController;


