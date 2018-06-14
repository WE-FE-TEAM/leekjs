/**
 *
 * Created by Jess on 2018/6/7.
 */

'use strict';

const path = require('path');

const config = {};


config.log = {
    name: 'leek_demo',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'warn',
            path: path.normalize(`${leek.appRoot}/log/warn.log`)
        },
        {
            level: 'error',
            path: path.normalize(`${leek.appRoot}/log/error.log`)
        }
    ]
};

config.view = {

    engineOptions: {

        nunjucks: {
            noCache: true
        }
    }
};

config.backend = {

    user: {
        host: '127.0.0.1',
        port: 7000
    }
};

module.exports = config;


