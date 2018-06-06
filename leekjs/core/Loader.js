/**
 * 负责从各个加载目录，加载各种组件
 * Created by Jess on 2018/5/23.
 */

'use strict';

const path = require('path');

const Request = require('koa/lib/request.js');
const Response = require('koa/lib/response.js');
const Context = require('koa/lib/context.js');
const Application = require('koa/lib/application.js').prototype;
const Service = require('./base/service.js').prototype;
const Policy = require('./base/policy.js').prototype;
const Controller = require('./base/controller.js').prototype;

const _ = require('lodash');

const debug = require('debug')('leek:loader');
const util = require('./util');

class Loader {

    constructor(args){
        this.frameworkRoot = args.frameworkRoot;
        this.appRoot = args.appRoot;
        this.env = args.env;
        this.app = args.app;

        this.filePattern = {
            plugin: [
                `/lib/config/plugin.js`,
                `/lib/config/plugin.${this.env}.js`,
            ],
            //系统运行依赖的配置
            systemConfig: [
                `/lib/config/config.js`,
                `/lib/config/config.${this.env}.js`,
            ],
            //查找APP中的所有模块
            module: '/module/*',
            //APP中，各个业务模块自定义的配置项，不影响APP的启动流程
            moduleConfig: [
                `/config/config.js`,
                `/config/config.${this.env}.js`,
            ],
            extend: {
                request: `/lib/extend/request.js`,
                response: `/lib/extend/response.js`,
                context: `/lib/extend/context.js`,
                application: `/lib/extend/application.js`,
                service: `/lib/extend/service.js`,
                policy: `/lib/extend/policy.js`,
                controller: `/lib/extend/controller.js`,
            },
            //组件定义的目录模式，
            definition: {
                middleware: `/lib/middleware/*.js`,
                // **service** 允许有子目录，并且会把子目录，替换成 . ，
                // 比如 service/passport/user.js ，会加载成 passport.user 这个service
                service: `/lib/service/**/*.js`,
                policy: `/lib/policy/*.js`,
                controller: `/module/*/controller/**/*.js`,
            },
            //作为在应用启动前，提前调用各个unit下的app.js，方便应用在启动前，做一些自定义操作
            appHook: `app.js`
        };

        //需要扩展的对象
        this.extendList = [
            {
                name: 'request',
                proto: Request
            },
            {
                name: 'response',
                proto: Response
            },
            {
                name: 'context',
                proto: Context
            },
            {
                name: 'application',
                proto: Application
            },
            {
                name: 'service',
                proto: Service
            },
            {
                name: 'policy',
                proto: Policy
            },
            {
                name: 'controller',
                proto: Controller
            }
        ];

        this.pluginDirs = this.findPluginDirList();
        debug(`启用的插件目录：`, this.pluginDirs);

        this.moduleDirs = this.findModuleDirList();
        debug(`APP中所有模块目录：`, this.moduleDirs);
        
        let loadUnit = [];
        loadUnit.push({
            type: 'framework',
            dir: this.frameworkRoot
        });
        this.pluginDirs.forEach( (pluginDir) => {
            loadUnit.push({
                type: 'plugin',
                dir: pluginDir
            });
        });
        loadUnit.push({
            type: 'app',
            dir: this.appRoot
        });
        
        this.loadUnit = loadUnit;
        debug(`所有的load unit: `, loadUnit);
    }

    /**
     * 根据当前执行环境，得到需要加载的所有插件目录列表
     * @returns {Array}
     */
    findPluginDirList(){
        let out = [];

        let frameworkPluginConfFiles = util.findFiles(this.frameworkRoot, this.filePattern.plugin);
        let appPluginConfFiles = util.findFiles(this.appRoot, this.filePattern.plugin);

        let confList = frameworkPluginConfFiles.concat(appPluginConfFiles);

        if( confList.length ){
            out = require( confList[ confList.length - 1 ]);
        }

        out = out.map( (conf) => {
            if( conf.package ){
                return require.resolve(conf.package);
            }
            return conf.path;
        });


        return out;
    }

    /**
     * 找出应用中所有的模块目录
     * @returns {Array}
     */
    findModuleDirList(){
        let out = [];

        out = util.findFiles(this.appRoot, this.filePattern.module, { onlyDirectories: true });

        return out;
    }

    /**
     * 按照 framework -> plugin -> app 的顺序，分别加载各个单元下的系统配置文件
     * @returns {*|{}}
     */
    loadSystemConfig(){
        let confFiles = [];
        this.loadUnit.forEach((unit) => {
            confFiles = confFiles.concat( util.findFiles(unit.dir, this.filePattern.systemConfig));
        });

        debug(`system config file list: `, confFiles);
        return util.mergeConfigFiles(confFiles);
    }

    loadExtend(){
        this.extendList.forEach( (obj) => {
            this.loadExtendByName(obj.name, obj.proto);
        });
    }

    loadExtendByName(extendName, proto){
        const pattern = this.filePattern.extend[extendName];
        this.loadUnit.forEach( (unit) => {
            let files = util.findFiles(unit.dir, pattern);
            util.mergePrototype(proto, files, extendName, this.app);
        });
    }

    /**
     * 找出系统中所有的middleware，但是并不会 加载 ，最终会根据systemConfig配置，来决定要加载哪些middleware
     * @returns {Map}
     */
    loadMiddleware(){
        const middlewareMap = new Map();
        this.loadUnit.forEach((unit) => {
            let files = util.findFiles(unit.dir, this.filePattern.definition.middleware);
            files.forEach((filePath) => {
                //middleware的文件名作为名字
                let name = path.basename(filePath, '.js');
                if(middlewareMap.has(name)){
                    debug(`发现同名的middleware [%s] 被替换的是[%s]  优先级更高的是[%s]`, name, middlewareMap.get(name), filePath);
                }
                middlewareMap.set(name, filePath);
            });
        });
        return middlewareMap;
    }

    /**
     * **加载** 系统中所有定义的policy
     * 用policy的文件名作为policy名字，export的对象，作为对应的value
     * @returns {Map}
     */
    loadPolicy(){
        let policyMap = new Map();
        this.loadUnit.forEach((unit) => {
            let files = util.findFiles(unit.dir, this.filePattern.definition.policy);
            files.forEach((filePath) => {
                //文件名作为名字
                let name = path.basename(filePath, '.js');
                if(policyMap.has(name)){
                    debug(`发现同名的 policy [%s] 被替换的是[%s]  优先级更高的是[%s]`, name, policyMap.get(name), filePath);
                }
                policyMap.set(name, filePath);
            });
        });

        let out = new Map();
        for(let [key, val] of policyMap){
            out.set(key, require(val));
        }

        return out;
    }

    /**
     * **加载** 系统中的service，以service文件相对于 `lib/service` 的子路劲和文件名，作为key，export对象作为value
     * @returns {Map}
     */
    loadService(){
        let serviceMap = new Map();
        this.loadUnit.forEach((unit) => {
            let files = util.findFiles(unit.dir, this.filePattern.definition.service);
            files.forEach((filePath) => {
                // 文件相对于 /lib/service 的路径和文件名，一起作为名字
                let subPath = path.relative(filePath, unit.dir);
                let name = subPath.replace(/\.js$/,'');
                if(serviceMap.has(name)){
                    debug(`发现同名的 service [%s] 被替换的是[%s]  优先级更高的是[%s]`, name, serviceMap.get(name), filePath);
                }
                serviceMap.set(name, filePath);
            });
        });

        let out = new Map();
        for(let [key, val] of serviceMap){
            out.set(key, require(val));
        }

        return out;
    }

    /**
     * 执行各个 unit 根目录下的 app.js ，如果存在的话
     */
    runAppHook(){
        this.loadUnit.forEach( (unit) => {
            let files = util.findFiles(unit.dir, this.filePattern.appHook);
            files.forEach( (filePath) => {
                let fn = require(filePath);
                fn(this.app);
            });
        });
    }

    /**
     * **加载合并** 应用层，各个module下自己定义的配置文件
     * 只会在 APP 的各个module目录下搜索
     * @returns {*|{}}
     */
    loadModuleConfig(){

        let config = {};
        const moduleRoot = `${this.appRoot}/module`;
        this.moduleDirs.forEach( (moduleDir) => {
            let moduleName = moduleDir.replace(moduleRoot, '');
            //模块名
            moduleName = moduleName.replace(/\//g, '');

            let files = util.findFiles(moduleDir, this.filePattern.moduleConfig);

            debug(`module config file list for [%s]:  %O`, moduleName, files);
            config[moduleName] = util.mergeConfigFiles(files);
        });

        return config;
    }

    /**
     * **加载** 应用中定义的controller
     * 以 module 名 + controller的子路径，作为key，controller export的类，作为value
     * controller只会在 APP 层定义，**不会** 搜索 framework和plugin
     * @returns {Map}
     */
    loadController(){
        let controllerMap = new Map();

        let files = util.findFiles(this.appRoot, this.filePattern.definition.controller);
        files.forEach((filePath) => {
            // 文件相对于 /module 的路径和文件名，一起作为名字
            let subPath = path.relative(this.appRoot, filePath);
            let reg = /^module\/([^\/]+)\/controller\/(.+)\.js$/;
            let temp = reg.exec(subPath);
            let moduleName = temp[1];
            let controllerPath = temp[2];
            let name = `${moduleName}/${controllerPath}`;
            controllerMap.set(name, require(filePath));
        });

        return controllerMap;
    }

}



module.exports = Loader;


