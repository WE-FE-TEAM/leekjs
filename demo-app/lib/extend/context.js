/**
 * 扩展框架默认的 Context 对象
 * Created by Jess on 2018/6/5.
 */

'use strict';



module.exports = {

    get clientInfo(){
        return {
            ua: this.request.header['user-agent'],
            ip: this.ip
        };
    }
};


