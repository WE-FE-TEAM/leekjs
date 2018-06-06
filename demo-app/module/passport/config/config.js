/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';



module.exports = {

    policy: {

        index: {
            '*': [ { name: 'add_state', data: 'ddddd'}, 'session_user' ],
            state: []
        }
    },

    test: {
        a: 1111,
        qq: {
            name: 'test',
            age: 90,
            number: '1234567'
        }
    }
};