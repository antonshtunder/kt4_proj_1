let configValues = require('./config');
module.exports={
    getDbConnectionString: function(){
        return 'postgres://'+configValues.username+':'+configValues.password
            +'@'+configValues.host+':'+configValues.port+'/'+configValues.dbname;
    }
}