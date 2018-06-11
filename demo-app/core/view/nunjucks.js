/**
 * 挂载更多的 nunjucks filter
 * Created by Jess on 2018/6/11.
 */

'use strict';


module.exports = (env) => {

    env.addGlobal('Date', Date);

    env.addFilter('rrdUpper', function(str){
        str = str || '';
        return str.toUpperCase() + '-rrd';
    });

};