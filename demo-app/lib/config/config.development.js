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

module.exports = config;


