/**
 * 具体的某个服务
 * Created by Jess on 2018/6/13.
 */

'use strict';


const path = require('path');
const Service = require( path.normalize( leek.appRoot + '/core/base/Service.js') );

class SimpleService extends Service{

    constructor(ctx){
        super(ctx);

        const backendConfig = ctx.getConfig('backend') || {};

        this.backend = backendConfig.user;
    }


    async getUserDetail(userId){
        return super.safeCurl('/search/acjson', {
            method: 'GET',
            data: {
                tn: 'resultjson_com',
                word: 'qq',
                ie: 'utf-8',
                pn: 0,
                rn: 30,
                ipn: 'rj',
                user_id: userId,
            },
            dataType: 'json',
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
            }
        });
    }

    async requestLocal(data){
        return super.safeCurl('/dapp/passport/index/test_json', {
            data: data,
            dataType: 'json',
            headers: {
                'Cookie': 'JSESSIONID=xxxxx;bd=1;aaa=q2aa'
            }
        })
    }
}



module.exports = SimpleService;


