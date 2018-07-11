/**
 * 应用入口
 * Created by Jess on 2018/5/23.
 */

'use strict';

const path = require('path');
const querystring = require('querystring');
const delegates = require('delegates');
const path2reg = require('path-to-regexp');
const _ = require('lodash');
const mount = require('koa-mount');

const leek = global.leek;

const LeekKoaApplication = require('./base/LeekKoaApplication');

const Loader = require('./Loader.js');

const leekUtil = require('./util.js');

const HttpHandler = require('./HttpHandler.js');


class LeekApp {

    constructor(args){

        this.leek = leek;

        leek.frameworkRoot = this.frameworkRoot = path.normalize(`${__dirname}/../`);
        leek.appRoot = this.appRoot = args.appRoot;
        this.listenPort = parseInt(args.port || process.env.port, 10);
        //默认执行换成是 production
        this.env = process.env.NODE_ENV || 'production';
        //日志的根目录
        this.logRoot = args.logRoot;
        //访问controller的URL前缀
        this.prefix = args.prefix || '';

        this.unhandledRejection = this.unhandledRejection.bind( this );
        this.uncaughtException = this.uncaughtException.bind( this );
        this.handleHttp = this.handleHttp.bind( this );

        process.on('unhandledRejection', this.unhandledRejection);
        process.on('uncaughtException', this.uncaughtException);

        leek.app = this.app = new LeekKoaApplication();

        this.plugin = [];
        //会影响到应用加载流程的配置项
        this.systemConfig = {};
        //app内，每个module自己的配置
        this.moduleConfig = {};
        this.middlewareMap = new Map();
        this.policyMap = new Map();
        this.serviceMap = new Map();
        this.controllerMap = new Map();

        this.rewriteRule = [];

        this.loader = new Loader({
            frameworkRoot: this.frameworkRoot,
            appRoot: this.appRoot,
            env: this.env,
            app: this.app,
            leekApp: this
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

    load(){
        this.systemConfig = this.loader.loadSystemConfig();
        //初始化log对象
        const log = this.app.log;

        this.initRewriteRule();
        this.loader.loadExtend();
        this.middlewareMap = this.loader.loadMiddleware();
        this.serviceMap = this.loader.loadService();
        this.policyMap = this.loader.loadPolicy();
        this.moduleConfig = this.loader.loadModuleConfig();
        this.controllerMap = this.loader.loadController();
        this.loader.runAppHook();
    }

    initRewriteRule(){
        const rewrite = this.systemConfig['rewrite'] || [];
        const rules = rewrite.map( (obj) => {
            const out = {
                rewrite: obj.rewrite
            };
            const keys = [];
            const reg = path2reg(obj.match, keys);
            out.match = reg;
            out.keys = keys;
            //原始的match配置，是string类型的
            out.isStringMatch = _.isString(obj.match);
            out.overrideQuery = obj.overrideQuery !== false;

            return out;
        });

        this.rewriteRule = rules;
    }

    _attachMiddlewareList(){

        const arr =  this.systemConfig.middleware || [];
        const middlewareOption = this.systemConfig.middlewareOption || {};

        //先挂载 systemConfig.coreMiddleware
        //然后挂载应用层的 systemConfig.appMiddleware
        arr.forEach( (conf) => {
            const name = conf.package || conf.name;
            const options = leekUtil.deepMergeObject(conf.options || {}, middlewareOption[name]);
            //package 表明是从 node_modules 加载中间件
            let file = conf.package;
            if( ! file ){
                file = this.middlewareMap.get(name);
            }
            const fn = require( file );
            this._useMiddleware(fn, options, name);
        });

        //最后自动挂载controller入口
        let finalMiddleware = this.handleHttp;
        if( this.prefix ){
            finalMiddleware = mount(this.prefix, this.handleHttp);
        }
        this.app.use( finalMiddleware );
    }

    _useMiddleware(middleware, options, name){
        const fn = middleware(options, this.app);
        this.app.use( fn );
    }

    /**
     * 作为middleware链中的最后一个，负责解析具体的 module、controller、action，并启动执行
     * @param ctx {Context}
     * @param next {function}
     * @returns {Promise.<void>}
     */
    async handleHttp(ctx, next){

        //使用 koa-mount 之后，已经自动去掉了前缀
        //去掉prefix
        // if( this.prefix ){
        //     let rewritePath = ctx.rewritePath;
        //     if( rewritePath.indexOf(this.prefix) === 0 ){
        //         ctx.rewritePath = rewritePath.replace(this.prefix, '');
        //     }
        // }

        const matchedRule = leekUtil.matchRule(ctx, this.rewriteRule);
        const out = leekUtil.parseController(ctx, this.controllerMap);
        if( ! out.module ){
            //404请求
            return await ctx.e404();
        }

        ctx.module = out.module;
        ctx.controller = out.controller;
        ctx.controllerClass = out.controllerClass;
        ctx.action = out.action;

        let httpHandler = new HttpHandler(ctx);
        try{
            await httpHandler.run();
        }catch(e){
            await ctx.e500(e);
        }
    }

    async run(){
        this.load();
        this._attachMiddlewareList();
        //触发服务前的广播
        try{
            await this.app.triggerStart();
        }catch(err){
            this.app.log.error(`执行 app.triggerStart 出错：`, err);
        }
        this.app.listen(this.listenPort);
    }

    exit(code = 0){
        process.exit(code);
    }
}


delegates(LeekApp.prototype, 'leek')
    .access('systemConfig')
    .access('moduleConfig')
    .access('policyMap')
    .access('serviceMap')
    .access('controllerMap');


module.exports = LeekApp;


