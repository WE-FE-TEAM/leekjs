/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';


module.exports = {

    middlewareOption: {

        leek_session: {
            keys: [  ],
            key: 'leek:sess', /** (string) cookie key (default is koa:sess) */
            /** (number || 'session') maxAge in ms (default is 1 days) */
            /** 'session' will result in a cookie that expires when session/browser is closed */
            /** Warning: If a session cookie is stolen, this cookie will never expire */
            maxAge: 86400000,
            overwrite: true, /** (boolean) can overwrite or not (default true) */
            httpOnly: true, /** (boolean) httpOnly or not (default true) */
            signed: true, /** (boolean) signed or not (default true) */
            rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
            renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
            //这个prefix，cookie里的value和redis里的，是一样的，感觉不是很好，不希望把redis内的key暴露到外部
            prefix: '',
            //单独引入一个redis内部的key，让redis里和cookie里，不是完全一样
            redisPrefix: ''
        }

    },

};