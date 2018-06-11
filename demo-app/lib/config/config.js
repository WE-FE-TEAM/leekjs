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
    }
];

//覆盖默认的中间件配置
config.middlewareOption = {
    leek_static: {
        '$mountPath': '/ds',
        root: path.normalize(`${leek.appRoot}/static/`)
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
    ]
};


module.exports = config;


