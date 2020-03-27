const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: String,
    email: String,
    username: String,
    provider: String,
    google: {},
    facebook: {}
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);