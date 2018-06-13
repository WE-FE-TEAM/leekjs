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
                user_id: userId
            }
        });
    }
}



module.exports = SimpleService;


