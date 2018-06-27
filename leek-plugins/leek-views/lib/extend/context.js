/**
 * 扩展 Context 对象，增加 render 方法
 * Created by Jess on 2018/6/8.
 */

'use strict';


const path = require('path');

const TEMPLATE_WITH_EXTENSION = Symbol('leek-views:context:template-with-extension');

module.exports = {

    /**
     * 解析出模板的最终渲染文件的绝对路径
     * @param tplName {string} 模板名，可能是相对路径，可能不包含后缀
     * @returns {*|string}
     */
    resolveTemplate(tplName){
        return this.app.viewManager.resolveTemplate(tplName);
    },

    /**
     * 渲染模板，并且赋值到body上
     * @param tplName {string}
     * @param data {object}
     * @returns {Promise.<void>}
     */
    async render(tplName, data){
        this.body = await this.renderToString(tplName, data);
    },

    /**
     * 只渲染模板，返回内容，不输出给body
     * @param tplName {string}
     * @param data {object}
     * @returns {Promise.<string>}
     */
    async renderToString(tplName, data){
        const engine = this.app.viewManager.getViewEngine(tplName);
        this.assign(data);
        return engine.render(tplName, this.state);
    }
};


