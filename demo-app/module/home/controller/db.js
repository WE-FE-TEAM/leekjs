/**
 * 测试数据库访问
 * Created by Jess on 2018/6/14.
 */

'use strict';

class DBController extends leek.Controller{

    async mysqlAction(){
        const { ctx } = this;

        let out = await ctx.app.mysql.select('tb_app', {
            where: {
                id: 37
            },
            limit: 1
        });

        ctx.body = {
            status: 0,
            data: out
        };
    }

    async redisAction(){

        const { ctx } = this;

        let result = await ctx.app.redis.set('hello', 'leek-redis');

        ctx.body = {
            status: 0,
            data: result
        };
    }

    async redis2Action(){

        const { ctx } = this;

        let result = await ctx.app.redis.get('hello');

        ctx.body = {
            status: 0,
            data: result
        };
    }

}



module.exports = DBController;

