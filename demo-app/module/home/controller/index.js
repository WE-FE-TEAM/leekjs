/**
 *
 * Created by Jess on 2018/6/11.
 */

'use strict';

class IndexController extends leek.Controller{

    async helloAction(){

        await this.ctx.render('home/page/index/index.nj');
    }
}



module.exports = IndexController;


