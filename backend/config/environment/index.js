const _ = require('lodash');

const all = {
    env: process.env.NODE_ENV,
    clientPort: process.env.CLIENT_PORT,
    port: process.env.PORT || 5000,
    baseUrl: 'http://localhost:5000',
    secrets: {
        session: 'documents-secret'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '694752243466-8dnn58v4majnii5cmb6f5tlr74bce1tu.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'ETQd4Nxus7zDG-B_GcLes1Ui',
        callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
    },
};

module.exports = _.merge(
    all,
    require(`./${process.env.NODE_ENV || 'development'}.js`) || {}
);
