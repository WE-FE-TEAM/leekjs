/**
 * 扩展 Context 对象，增加 render 方法
 * Created by Jess on 2018/6/8.
 */

'use strict';



module.exports = {

    /**
     * 渲染模板，并且赋值到body上
     * @param tplName {string}
     * @param data {object}
     * @returns {Promise.<void>}
     */
    async render(tplName, data){
        const engine = this.app.viewManager.getViewEngine(tplName);
        this.assign(data);
        this.body = await engine.render(tplName, this.state);
    }
};


