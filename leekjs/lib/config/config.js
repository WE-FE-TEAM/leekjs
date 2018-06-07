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

//默认的日志
config.log = {
    name: 'leekapp',
    streams: [
        {
            level: 'info',
            stream: process.stdout,
        }
    ],
};

//请求级别的log配置
config.contextLog = {
    //某次http请求的惟一id，在header中的命名
    reqIdHeader : 'x-req-id',
    //如果请求中不包含上述header，是否自动生成一个
    generateReqId: true
};

module.exports = config;