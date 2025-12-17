const mongoose = require('mongoose');
const User = require('./User');

const urlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    originalUrl: {
        type: String,
        required: true,
    },

    shortId: {
        type: String,
        required: true,
        unique: true
    },

    clickCount: {
        type: Number,
        default: 0,
    },
},{ timestamps: true });

module.exports = mongoose.model('Url',urlSchema);