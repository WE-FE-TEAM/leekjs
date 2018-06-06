/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';


module.exports = {

    policy: {

        index: {
            '*': [ 'dev_only' ]
        }
    },

    test: {
        bb: 'bbbbb',
        qq: {
            gender: 'male',
            age: '120'
        }
    }
};