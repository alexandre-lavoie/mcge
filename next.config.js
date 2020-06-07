const path = require('path');
const webpack = require('webpack');

module.exports = {
    webpack: (config, { dev }) => {
        config.plugins.push(new webpack.IgnorePlugin({
            checkResource: (_, context) => {
                if(/(express_api|server_package)/.test(context)) {
                    console.log(context);
                }
                
                return /(express_api|server_package)/.test(context);
            } 
        }));

        return config;
    }
}