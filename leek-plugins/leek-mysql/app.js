/**
 *
 * Created by Jess on 2018/6/14.
 */

'use strict';

const debug = require('debug')('leek-mysql');
const LeekMysql = require('./core/LeekMysql.js');


module.exports = function(app){


    const config = leek.getConfig('mysql') || {};

    debug(`mysql配置：%j`, config);

    const mysql = new LeekMysql(config, app);

    mysql.init();

    Object.defineProperty(app, 'mysql', {
        value: mysql,
        writable: false
    });

    //服务启动前，测试下发送请求
    app.beforeStart( async () => {
        try{
            let out = await mysql.query('SELECT 1 + 1 AS solution');
            debug(`[SELECT 1 + 1 AS solution]结果：%j`, out);
        }catch(err){
            app.log.error(`[leek-mysql]测试mysql请求失败！`, err);
        }
    });

};