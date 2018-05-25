/**
 * 继承自 KoaApplication
 * Created by Jess on 2018/5/23.
 */

'use strict';

const KoaApplication = require('koa');


class LeekKoaApplication extends KoaApplication{

    getConfig(module, key){
        return leek.getConfig(module, key);
    }
}



module.exports = LeekKoaApplication;

