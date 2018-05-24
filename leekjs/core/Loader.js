/**
 * 负责从各个加载目录，加载各种组件
 * Created by Jess on 2018/5/23.
 */

'use strict';

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
            //APP中，各个业务模块自定义的配置项，不影响APP的启动流程
            moduleConfig: [
                `/module/*/config/config.js`,
                `/module/*/config/config.${this.env}.js`,
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
            }
        };

        this.pluginDirs = this.getPluginDirList();
        debug(`启用的插件目录：`, this.pluginDirs);
    }

    /**
     * 根据当前执行环境，得到需要加载的所有插件目录列表
     * @returns {Array}
     */
    async getPluginDirList(){
        let out = [];

        let frameworkPluginConfFiles = await util.findFiles(this.frameworkRoot, this.filePattern.plugin);
        let appPluginConfFiles = await util.findFiles(this.appRoot, this.filePattern.plugin);

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

    loadSystemConfig(){

    }

    loadExtend(){

    }

    loadMiddleware(){

    }

    loadPolicy(){

    }

    loadService(){

    }

    runAppHook(){

    }

    loadModuleConfig(){

    }

    loadController(){
        
    }

}



module.exports = Loader;


