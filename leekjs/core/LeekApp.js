/**
 * 应用入口
 * Created by Jess on 2018/5/23.
 */

'use strict';

const path = require('path');

const LeekKoaApplication = require('./base/LeekKoaApplication');

const Loader = require('./Loader.js');


class LeekApp {

    constructor(args){

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
        this.middlewareMap = {};
        this.policyMap = {};
        this.serviceMap = {};
        this.moduleMap = {};

        this.loader = new Loader({
            frameworkRoot: this.frameworkRoot,
            appRoot: this.appRoot,
            env: this.env,
            app: this.app
        });
    }

    unhandledRejection(reason, p){
        console.log('Unhandled Rejection at:', p, 'reason:', reason);
        this.exit(1);
    }

    uncaughtException(err){
        console.error(`[uncaughtException]`, err);
        this.exit(1);
    }

    load(){
        this.systemConfig = this.loader.loadSystemConfig();

    }

    _attachMiddleware(){}

    run(){

    }

    exit(code = 0){
        process.exit(code);
    }
}



module.exports = LeekApp;


