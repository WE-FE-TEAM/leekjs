/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';


class RedisStore {

    constructor(redisClient, options){
        this.client = redisClient;
        this.options = options;
        this.prefix = options.prefix || '';
    }

    async get(sid){
        const key = this.getFinalKey(sid);
        const out = await this.client.get(key);
        if( ! out ){
            return null;
        }
        return JSON.parse(out);
    }

    async set(key, value, maxAge){
        key = this.getFinalKey(key);
        value = JSON.stringify(value);
        return this.client.set(key, value, 'PX', maxAge);
    }

    async destroy(key){
        key = this.getFinalKey(key);
        return await this.client.del(key);
    }

    getFinalKey(sid){
        return this.prefix + sid;
    }


}



module.exports = RedisStore;


