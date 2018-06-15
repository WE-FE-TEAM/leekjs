/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';

const Redis = require('ioredis');
const debug = require('debug')('leek-redis');

module.exports = function(app){

    const config = leek.getConfig('redis');

    debug(`redis配置：%j`, config);

    let client = null;

    if( config.isCluster ){
        client = new Redis.Cluster(config.clusterServer, config.clusterOptions);
    }else{
        client = new Redis(config.options);
    }

    Object.defineProperty(app, 'redis', {
        value: client,
        writable: false
    });

};