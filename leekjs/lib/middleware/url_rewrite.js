/**
 * 负责根据用户配置的 systemConfig.rewrite ，决定是否进行rewrite
 * Created by Jess on 2018/5/25.
 */

'use strict';


module.exports = function(options, app){

    const rewrite = app.getConfig('rewrite') || [];

    return async function urlRewrite(){

    }
};


