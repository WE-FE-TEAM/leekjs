/**
 *
 * Created by Jess on 2018/5/23.
 */

'use strict';

const fg = require('fast-glob');
const _ = require('lodash');


/**
 * 自定义的配置合并过程，如果值是数组，则直接覆盖
 * @param objValue
 * @param srcValue
 * @returns {*}
 */
function mergeHandle(objValue, srcValue){
    if (_.isArray(srcValue)) {
        return srcValue;
    }
}

let util = {

    /**
     * 查找某个目录下，满足某种GLOB模式的文件，返回所有文件列表
     * @param baseDir {string} 基础目录
     * @param pattern {Array} 模式数组
     * @returns {Array} 匹配的文件路径列表
     */
    async findFiles(baseDir, pattern){
        let out = [];

        if(typeof pattern === 'string'){
            pattern = [ `${baseDir}${pattern}` ];
        }else{
            pattern = pattern.map( (obj) => {
                return `${baseDir}${obj}`;
            });
        }

        out = fg.sync(pattern);

        return out;
    },

    /**
     * 加载配置文件数组中的文件，merge成一个配置，数组中靠后的同名配置项会覆盖前面的
     * @param confArray {Array} 要加载的文件列表
     * @returns {{}}
     */
    mergeConfigFiles(confArray){
        let out = {};

        confArray.forEach( (file) => {
            let conf = require(file);
            _.mergeWith(out, conf, mergeHandle);
        });

        return out;
    }
};



module.exports = util;

