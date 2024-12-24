const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    productcreatoremail: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    chargingtype: { type: String },
    chargingCurrency: { coin: { type: String } },
    billing_cycle: {
        monthly: {
            price: { type: String },
            coin: { type: String }
        }
    },
    serviceProvider: { type: String },
    access: { type: String },
    goal: { type: String },
    icon: { type: String},
    cost: { type: String},
    price: { type: String},
    discountType: { type: String},
    discountAmount: { type: String},
    duration: { type: String},
    features: { type: String},
    status: { type: String, enum: ['active', 'inactive','delete'], default: 'active' },
    outcome: { type: String},
    type: { type: String, enum: ['Macro', 'Micro','Nano']},
    financialSituation: [
        {
            finance: { type: String, enum: ['0-25L', '25-75L', '75L-3CR', '3CR+', "other"] },
            description: { type: String },
        }
    ],
    grade: [
        {
            grade: { type: String, enum: ['9', '10', '11', '12'] },
            description: { type: String },
        }
    ],
    stream: [
        {
            stream: { type: String, enum: ['MPC', 'BIPC', 'CEC', 'MEC', 'HEC'] },
            description: { type: String },
        }
    ],
    iterations: { type: String }
}, {
    timestamps: true,
});

module.exports = mongoose.model('naavi_services', servicesSchema);
