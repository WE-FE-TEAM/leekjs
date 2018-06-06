/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';

const config = {};

config.coreMiddleware = [
    {
        name: 'leek_static',
    },
    {
        package: 'koa-bodyparser'
    }
];



module.exports = config;