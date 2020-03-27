const mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Link', LinkSchema);