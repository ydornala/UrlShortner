import mongoose from 'mongoose';

var LinkSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    clicks: {type:Number, default: 0},
    clickedBy: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        index: true,
        unique: true
    }]
}, {
    timestamps: true
});

export default mongoose.model('Link', LinkSchema);