const _ = require('lodash');

const all = {
    env: process.env.NODE_ENV,
    clientPort: process.env.CLIENT_PORT,
    port: process.env.PORT || 5000,
    baseUrl: 'http://localhost:5000'
};

module.exports = _.merge(
    all,
    require(`./${process.env.NODE_ENV || 'development'}.js`) || {}
);
