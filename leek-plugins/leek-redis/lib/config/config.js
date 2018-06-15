/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';


module.exports = {

    redis: {

        //单机模式的redis配置
        options: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            family: 4,           // 4 (IPv4) or 6 (IPv6)
            db: 0
        },

        //是否是集群模式
        isCluster: false,
        clusterServer: [],
        clusterOptions: {}

    }
};