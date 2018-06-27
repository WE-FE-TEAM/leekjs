/**
 * 负责维护应用中添加的一系列模板引擎
 * Created by Jess on 2018/6/11.
 */

'use strict';

const path = require('path');
const assert = require('assert');

class ViewManager {

    constructor(config){

        //默认的模板后缀
        this.defaultExtension = config.defaultExtension || '';

        this.config = config;

        //存储模板后缀名，和对应的模板处理引擎实例
        this.engineMap = new Map();
    }

    init(){
        const config = this.config;
        const engines = config.engines || [];
        const engineOptions = config.engineOptions || {};
        const nameMap = new Map();
        engines.forEach( (conf) => {
            const options = Object.assign({}, engineOptions[conf.name], conf.options);
            const engine = new conf.engine(options);
            engine.init();
            nameMap.set(conf.name, engine);
        });

        const mapping = config.mapping || {};
        for(let extension in mapping){
            if( mapping.hasOwnProperty(extension)){
                const engineName = mapping[extension];
                const engine = nameMap.get(engineName);
                assert(engine, `未找到模板后缀[${extension}]对应的模板引擎实例[${engineName}]`);
                this.engineMap.set(extension, engine);
            }
        }
    }

    /**
     * 根据要渲染的模板文件，获取对应的模板引擎实例
     * @param tplPath {string} 模板文件相对路径
     * @returns {ViewEngine | null} 模板引擎实例
     */
    getViewEngine(tplPath){
        let extension = path.extname(tplPath);
        if( ! extension ){
            extension = this.defaultExtension;
        }
        const engine = this.engineMap.get(extension);
        assert(engine, `未找到模板对应的渲染引擎[${tplPath}]`);
        return engine;
    }

    /**
     * 解析出模板最终的文件路径
     * @param tplPath {string} 模板路径，可能是相对路径，可能不包含后缀
     * @returns {*|string} 包含后缀的最终模板绝对路径
     */
    resolveTemplate(tplPath){
        let extension = path.extname(tplPath);
        if( ! extension ){
            extension = this.defaultExtension;
            tplPath += extension;
        }
        const engine = this.engineMap.get(extension);
        assert(engine, `未找到模板对应的渲染引擎[${tplPath}]`);
        return engine.resolveTemplate(tplPath);
    }
}



module.exports = ViewManager;


