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
    }
];


module.exports = config;


