/**
 *
 * Created by Jess on 2018/6/5.
 */

'use strict';

const config = {};

//要加载的middleware列表
config.middleware = [
    {
        name: 'leek_meta',
        options: {

        }
    },
    {
        name: 'leek_static',
        options: {

        }
    },
    {
        package: 'koa-bodyparser',
        options: {

        }
    }
];

//各个middleware对应的配置
config.middlewareOption = {

    'leek_meta': {
        'x-powered-by': 'leek-v1',
        responseTimeHeader: 'x-res-time'
    }
};

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

//url驼峰转下划线、中划线。允许配置 下划线(_)、中划线(-)。会将controller action名字转换成对应的 snake  kebab 格式
config.urlBeautify = {
    controller: '_',
    action: '_'
};

module.exports = config;