/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';

const path = require('path');

const config = {};

//静态文件相关配置
config.static = {
    '$mountPath': '/ds',
    root: path.normalize(`${leek.appRoot}/static/`)
};

//rewrite
config.rewrite = [
    {
        match: '/',
        rewrite: '/home/v1/user/info?from=rewrite&test=qq'
    },
    {
        match: '/p/:name/:age',
        rewrite: '/passport/index/hello'
    },
    {
        match: /^\/p2\/([^\/]+)\/([^\/]+)/,
        rewrite: '/passport/index/state?q1=$1&q2=$2'
    }
];

//应用自己额外加的middleware
config.appMiddleware = [
    // {
    //     package: 'koa-etag'
    // }
];


module.exports = config;


