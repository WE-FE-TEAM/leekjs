/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';


class RedisStore {

    constructor(redisClient){
        this.client = redisClient;
    }

    async get(sid){
        const out = await this.client.get(sid);
        if( ! out ){
            return null;
        }
        return JSON.parse(out);
    }

    async set(key, value, maxAge){
        value = JSON.stringify(value);
        return this.client.set(key, value, 'PX', maxAge);
    }

    async destroy(key){
        return await this.client.del(key);
    }


}



module.exports = RedisStore;


