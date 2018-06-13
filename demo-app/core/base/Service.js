/**
 * 应用层自定义的service基类，可以提供一些应用本身的通用实现
 * Created by Jess on 2018/6/13.
 */

'use strict';


class DemoBaseService extends leek.Service{

    constructor(ctx){
        super(ctx);

        this.backend = {};
        this.demo = 'hello';
    }

    async safeCurl(url, ...args){
        const finalUrl = Object.assign({}, this.backend, {
            path: url
        });
        return this.ctx.curl(finalUrl,...args).catch( (err) => {
            return {
                status: -1,
                message: 'error',
                error: err
            };
        });
    }
}



module.exports = DemoBaseService;


