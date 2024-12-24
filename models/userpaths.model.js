const mongoose = require('mongoose');

const userPathSchema = new mongoose.Schema({
    email: { type: String },
    pathId: { type: mongoose.Types.ObjectId },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    completedSteps: [{ type: mongoose.Types.ObjectId }],
    currentStep: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('userPaths', userPathSchema);