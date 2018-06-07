/**
 * 封装下 koa-static
 * 主要是为了解决，静态文件，可以配置挂载前缀的问题
 * Created by Jess on 2018/6/5.
 */

'use strict';


const mount = require('koa-mount');
const serve = require('koa-static');



module.exports = function(options, app){

    const staticConfig = options || {};
    const urlPrefix = staticConfig['$mountPath'] || '/';

    return mount(urlPrefix, serve(staticConfig.root, staticConfig));
};


