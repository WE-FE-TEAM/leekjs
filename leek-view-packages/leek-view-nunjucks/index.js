/**
 * nunjucks 模板引擎的 适配类
 * Created by Jess on 2018/6/11.
 */

'use strict';

const nunjucks = require('nunjucks');

class LeekViewNunjucks{

    constructor(options){
        this.options = options;
        this.env = null;
    }

    init(){
        const options = this.options;
        const env = nunjucks.configure( options.rootDir, options);
        this.env = env;

        if( typeof options.customFunction === 'function' ){
            //允许用户指定一个函数，自己修改env，添加 filter extension 等等
            options.customFunction(env);
        }
    }

    async render(tplName, data){
        return new Promise((resolve, reject) => {
            this.env.render(tplName, data, (err, result) => {
                if( err ){
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}



module.exports = LeekViewNunjucks;


