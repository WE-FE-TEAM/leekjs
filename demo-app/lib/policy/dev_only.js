/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';

class DevOnlyPolicy extends leek.Policy{

    async execute(){

        console.log(`in dev_only policy`);

    }
}


module.exports = DevOnlyPolicy;

