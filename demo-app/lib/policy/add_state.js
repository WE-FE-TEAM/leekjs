/**
 *
 * Created by Jess on 2018/6/6.
 */

'use strict';

class AddStatePolicy extends leek.Policy{

    async execute(data){

        this.ctx.state.add_state_data = data;
    }
}


module.exports = AddStatePolicy;


