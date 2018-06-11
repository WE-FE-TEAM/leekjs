/**
 *
 * Created by Jess on 2018/6/11.
 */

'use strict';


module.exports = {

    view: {

        //要渲染的模板没有后缀时，默认的后缀名
        defaultExtension: '',

        //需要安装的模板引擎列表
        engines: [],

        //可以在这里指定各个引擎对应的options
        engineOptions: {

            nunjucks: {
                //http://mozilla.github.io/nunjucks/api.html#configure
                autoescape: true,
                throwOnUndefined: false,
                trimBlocks: false,
                lstripBlocks: false,
                watch: false,
                noCache: false,
                // 参考配置 http://mozilla.github.io/nunjucks/api.html#customizing-syntax
                tags: {
                    blockStart: '<%',
                    blockEnd: '%>',
                    variableStart: '<$',
                    variableEnd: '$>',
                    commentStart: '<#',
                    commentEnd: '#>'
                }
            }
        },

        //模板后缀和对应要使用的engine name
        mapping: {
            
            '.nj': 'nunjucks'
        }
    }

};