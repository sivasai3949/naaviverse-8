const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    country: { type: String },
    domains: {type:Array},
    alpha_two_code: { type: String },
    "state-province": { type: String },
    web_pages: { type: Array },
    name: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('universities', universitySchema);