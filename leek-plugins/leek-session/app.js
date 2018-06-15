/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';

const debug = require('debug')('leek-session');

module.exports = function(app){

    const config = app.getConfig('middlewareOption').leek_session;

    debug(`leek_session 配置文件 %j`, config);

    //设置用户签名的key
    app.keys = config.keys;

    app.on('session:missed', ({key, value, ctx}) => {
        app.log.warn(`[session:missed] key[%s] value[%j] reqId[%s]`, key, value, ctx.reqId);
    });

    app.on('session:invalid', ({key, value, ctx}) => {
        app.log.warn(`[session:invalid] key[%s] value[%j] reqId[%s]`, key, value, ctx.reqId);
    });

    app.on('session:expired', ({key, value, ctx}) => {
        app.log.warn(`[session:expired] key[%s] value[%j] reqId[%s]`, key, value, ctx.reqId);
    });
};