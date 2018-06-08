/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';


module.exports = {

    policy: {
        '*': [ { name: 'session_user', data: { k1: 'v1', a: 444} } ],
        'v1/user': {
            test2: [],
        },
        demo: {
            isUserPageShowed: []
        }
    }
};