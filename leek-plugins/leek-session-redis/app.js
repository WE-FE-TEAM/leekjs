/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';

const assert = require('assert');


const RedisStore = require('./core/RedisStore.js');

module.exports = function(app){

    assert(app.redis, `app.redis 不存在！leek-session-redis 依赖 leek-redis!`);

    const config = app.getConfig('middlewareOption').leek_session;

    const store = new RedisStore(app.redis, {
        prefix: config.redisPrefix || ''
    });

    app.sessionStore = store;
};