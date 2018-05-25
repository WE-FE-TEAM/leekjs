/**
 * 应用入口
 * Created by Jess on 2018/5/23.
 */

'use strict';

const path = require('path');
const delegates = require('delegates');

const leek = require('./leek.js');

const LeekKoaApplication = require('./base/LeekKoaApplication');

const Loader = require('./Loader.js');


class LeekApp {

    constructor(args){

        this.leek = leek;

        this.frameworkRoot = path.normalize(`${__dirname}/../`);
        this.appRoot = args.appRoot;
        this.listenPort = args.port || process.env.port;
        this.env = process.env.NODE_ENV;
        //日志的根目录
        this.logRoot = args.logRoot;

        this.unhandledRejection = this.unhandledRejection.bind( this );
        this.uncaughtException = this.uncaughtException.bind( this );

        process.on('unhandledRejection', this.unhandledRejection);
        process.on('uncaughtException', this.uncaughtException);

        this.app = new LeekKoaApplication();

        this.plugin = [];
        //会影响到应用加载流程的配置项
        this.systemConfig = {};
        //app内，每个module自己的配置
        this.moduleConfig = {};
        this.middlewareMap = new Map();
        this.policyMap = new Map();
        this.serviceMap = new Map();
        this.controllerMap = new Map();

        this.loader = new Loader({
            frameworkRoot: this.frameworkRoot,
            appRoot: this.appRoot,
            env: this.env,
            app: this.app
        });
    }

    unhandledRejection(reason, p){
        console.log('[unhandledRejection] at:', p, 'reason:', reason);
        this.exit(1);
    }

    uncaughtException(err){
        console.error(`[uncaughtException]`, err);
        this.exit(1);
    }

    init(){
        this.load();
        this._attachMiddlewareList();
        this.run();
    }

    load(){
        this.systemConfig = this.loader.loadSystemConfig();
        this.loader.loadExtend();
        this.middlewareMap = this.loader.loadMiddleware();
        this.moduleConfig = this.loader.loadModuleConfig();
        this.controllerMap = this.loader.loadController();
        this.loader.runAppHook();
    }

    _attachMiddlewareList(){
        //先挂载 systemConfig.coreMiddleware
        const coreMiddleware = this.systemConfig.coreMiddleware || [];
        coreMiddleware.forEach( (conf) => {
            const name = conf.name;
            const options = conf.options;
            this._useMiddleware(this.middlewareMap.get(name), options, name);
        });
        //挂载应用层的 systemConfig.appMiddleware
        const appMiddleware = this.systemConfig.appMiddleware || [];
        appMiddleware.forEach( (conf) => {
            const name = conf.name;
            const options = conf.options;
            this._useMiddleware(this.middlewareMap.get(name), options, name);
        });
    }

    _useMiddleware(middleware, options, name){
        const fn = middleware(options, this.app);
        this.app.use( fn );
    }

    run(){

    }

    exit(code = 0){
        process.exit(code);
    }
}


delegates(LeekApp.prototype, 'leek')
    .access('systemConfig')
    .access('moduleConfig')
    .access('serviceMap');


module.exports = LeekApp;


