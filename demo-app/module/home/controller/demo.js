/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';


const Controller = leek.Controller;

class DemoController extends Controller{

    async testAction(){
        const client = this.ctx.client;
        console.log(`client: `, client);
        this.ctx.body = 'hello leekjs';
    }
}


module.exports = DemoController;


