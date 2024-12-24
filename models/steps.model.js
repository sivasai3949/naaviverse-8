const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stepSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    micro_description: { type: String },
    micro_name: { type: String},
    micro_length: { type: String },
    micro_cost: { type: String, enum: ['free', 'an number', 'vendors descrestion', 'paid'], default: 'free' },
    micro_chances: { type: String },
    macro_description: { type: String },
    macro_name: { type: String},
    macro_length: { type: String },
    macro_cost: { type: String, enum: ['free', 'an number', 'vendors descrestion', 'paid'], default: 'free' },
    macro_chances: { type: String },
    nano_description: { type: String },
    nano_name: { type: String},
    nano_length: { type: String },
    nano_cost: { type: String, enum: ['free', 'an number', 'vendors descrestion', 'paid'], default: 'free' },
    nano_chances: { type: String },
    microservices: [{type: Schema.Types.ObjectId, ref: "naavi_services",},],
    macroservices: [{type: Schema.Types.ObjectId, ref: "naavi_services",},],
    nanoservices: [{type: Schema.Types.ObjectId, ref: "naavi_services",},],
    step_order: { type: String },
    path_id: {type: Schema.Types.ObjectId, ref: "paths",},
    status: { type: String, enum: ['active', 'inactive','delete'], default: 'active' }    
}, {
    timestamps: true
});

module.exports = mongoose.model('career_steps', stepSchema);