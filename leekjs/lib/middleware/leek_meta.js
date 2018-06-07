/**
 * 发送一些header头，比如 x-powered-by x-res-time 之类的
 * 参考 https://github.com/thinkjs/think-meta/blob/master/index.js
 * Created by Jess on 2018/6/7.
 */

'use strict';


module.exports = function(options, app){

    options = options || {};

    const X_POWERED_BY = 'x-powered-by';

    const powerBy = options[X_POWERED_BY] || '';
    const responseTimeHeader = options.responseTimeHeader || '';

    return async function leek_static(ctx, next){
        const start = Date.now();
        if( powerBy ){
            ctx.set(X_POWERED_BY, powerBy);
        }
        if( responseTimeHeader ){
            let err = null;
            try{
                await next();
            }catch(e){
                err = e;
            }
            const time = Date.now() - start;
            ctx.set(responseTimeHeader, time);
            if( err ){
                return Promise.reject(err);
            }
        }else{
            return next();
        }

    }

};