/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';

const path = require('path');

const config = {

};

//覆盖框架默认的中间件列表
config.middleware = [
    {
        name: 'leek_meta',
    },
    {
        name: 'leek_static',
    },
    {
        package: 'koa-bodyparser',
        options: {

        }
    },
    {
        name: 'leek_session'
    }
];

//覆盖默认的中间件配置
config.middlewareOption = {

    //静态资源
    leek_static: {
        '$mountPath': '/ds',
        root: path.normalize(`${leek.appRoot}/static/`)
    },

    //session
    leek_session: {
        keys : [ '1qstda', '12avrrr5y'],
        key: 'lsess',
        redisPrefix: 'nui:sess:'
    }
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

//模板相关配置
config.view = {

    defaultExtension: '.nj',

    engines: [
        {
            name: 'nunjucks',
            engine: require('leek-view-nunjucks'),
            options: {
                rootDir: path.normalize(`${leek.appRoot}/view`),
                customFunction: require('../../core/view/nunjucks.js'),
            }
        }
    ],

    engineOptions: {

        nunjucks: {

            tags: {
                blockStart: '{%',
                blockEnd: '%}',
                variableStart: '{{',
                variableEnd: '}}',
                commentStart: '{#',
                commentEnd: '#}'
            }
        }
    }
};

//后端服务的配置
config.backend = {

    //用户服务
    user: {
        host: 'image.baidu.com',
        port: 443,
        // protocol: 'https:'
    },

    //账户
    account: {
        host: 'www.google.com',
        port: 443
    }

};

config.mysql = {

    connectionLimit: 10,
    host: '172.16.3.173',
    user: 'root',
    password: '123123',
    database: 'rn_hot_update',
    charset: 'UTF8_GENERAL_CI',
    timezone: 'local',
    connectTimeout: 10000

};

config.redis = {

    options: {
        port: 6379,          // Redis port
        host: '127.0.0.1',   // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        db: 7
    },

    isCluster: false,

};


module.exports = config;


