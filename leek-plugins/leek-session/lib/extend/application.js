/**
 *
 * Created by Jess on 2018/6/15.
 */

'use strict';



module.exports = {

    set sessionStore(store){
        const sessionConfig = this.getConfig('middlewareOption').leek_session;
        if( ! store ){
            sessionConfig.store = undefined;
            return;
        }

        sessionConfig.store = store;
    },

    get sessionStore(){
        const sessionConfig = this.getConfig('middlewareOption').leek_session;
        return sessionConfig.store;
    }
};