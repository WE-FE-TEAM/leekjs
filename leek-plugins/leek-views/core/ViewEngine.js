/**
 * 模板处理引擎 base class。
 * 添加到系统中的各个模板引擎，必须继承这个基类，实现对应的方法。
 * 其实这是一个 interface，具体的模板引擎类，必须实现  init  render 两个方法就够了
 * Created by Jess on 2018/6/11.
 */

'use strict';

class ViewEngine{

    constructor(options){
        this.options = options || {};
    }

    init(){
        throw new Error(`[ViewEngine]子类[${this.constructor.name}]必须实现 init 方法！`);
    }

    /**
     * 渲染模板文件，返回渲染之后的 string 内容
     * @param tplPath {string} 模板相对路径
     * @param data {object?} 要传给模板的数据
     * @returns {Promise.<String>}
     */
    async render(tplPath, data){
        throw new Error(`[ViewEngine]子类[${this.constructor.name}]必须实现 async render 方法！`);
    }

    /**
     * 解析出模板的最终文件绝对路径
     * @param tplPath {string} 模板相对路径
     * @returns {string} 模板的绝对路径
     */
    resolveTemplate(tplPath){
        throw new Error(`[ViewEngine]子类必须实现 resolveTemplate 方法！`);
    }
}


module.exports = ViewEngine;


