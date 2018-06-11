/**
 *
 * Created by Jess on 2018/6/11.
 */

'use strict';

class IndexController extends leek.Controller{

    async helloAction(){

        this.assign({
            user: {
                name: '人人贷-微理财',
                age: '8',
                money: {
                    bigger: '大写数字'
                }
            },

        });

        await this.ctx.render('home/page/index/index.nj', {
            name: 'jessTest-hehe'
        });
    }

    async testErrorAction(){
        await this.ctx.render('fsda/fdaf');
    }
}



module.exports = IndexController;


