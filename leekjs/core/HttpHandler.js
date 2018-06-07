/**
 * 负责处理controller的执行
 * Created by Jess on 2018/6/4.
 */

'use strict';


const _ = require('lodash');


class HttpHandler{

    constructor(ctx){
        this.ctx = ctx;
    }

    async run(){
        try{
            let isOk = await this.runPolicy();
            if( ! isOk ){
                return;
            }
            await this.runController();
        }catch(e){
            await this.ctx.e500(e);
        }
    }

    /**
     * 执行当前module+controller+action对应的policy配置列表
     * 任意一个policy返回 false，都停止执行后续的policy和action
     * @returns {Promise.<Boolean>}
     */
    async runPolicy(){
        const ctx = this.ctx;
        let out = true;

        let policyList = this.getActionPolicy();
        for(let i = 0; i < policyList.length; i++){
            const policyConf = policyList[i];
            let policyName = '';
            let data = null;
            if( _.isObject(policyConf) ){
                policyName = policyConf.name;
                data = policyConf.data;
            }else if( _.isString(policyConf) ){
                policyName = policyConf;
            }else{
                throw new Error(`policy配置错误！单个policy，只能是 string 或者 object`);
            }
            let policyClass = leek.getPolicyClass(policyName);
            if( ! policyClass ){
                throw new Error(`未找到对应的policy类！name[${policyName}]`);
            }
            let instance = new policyClass(ctx);
            out = await instance.execute(data);
            //policy 中必须明确返回  false，才会阻止后续的执行
            out = out !== false;
            if( ! out ){
                //policy阻止了后续的执行
                break;
            }
        }

        return out;
    }

    async runController(){
        const ctx = this.ctx;
        const instance = new ctx.controllerClass(ctx);
        const actionName = `${ctx.action}Action`;
        if( typeof instance[actionName] !== 'function' ){
            await ctx.e404();
            return;
        }
        await instance[actionName]();
    }

    /**
     * 获取到当前请求action，需要执行的policy列表
     * @returns {Array}
     */
    getActionPolicy(){
        const ctx = this.ctx;
        let out = [];

        const moduleConf = leek.getConfig('policy', ctx.module);
        if( moduleConf ){
            out = moduleConf['*'] || [];
            const controllerConf = moduleConf[ctx.controller];
            if( controllerConf ){
                out = controllerConf['*'] || out;
                const actionConf = controllerConf[ctx.action];
                if( actionConf ){
                    out = actionConf;
                }
            }
        }

        return out;
    }
}


module.exports = HttpHandler;


