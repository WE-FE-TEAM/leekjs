/**
 *
 * Created by Jess on 2018/6/8.
 */

'use strict';


const ViewManager = require('./core/ViewManager.js');

//这里的  app，是   KoaApplication 对象
module.exports = function(app){

    const config = app.getConfig('view');

    const viewManager = new ViewManager(config);

    viewManager.init();

    Object.defineProperty(app, 'viewManager', {
        value: viewManager,
        writable: false
    });

};