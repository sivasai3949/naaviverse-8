const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pathSchema = new mongoose.Schema({
    email: { type: String },
    nameOfPath: { type: String, required: true },
    description: { type: String },
    current_coordinates: { type: String },
    feature_coordinates: { type: String },
    program: {type: String},
    university: [{type: Schema.Types.ObjectId, ref: "universities",},],
    the_ids: [{ step_id: mongoose.Types.ObjectId, backup_pathId: mongoose.Types.ObjectId }],
    path_type: { type: String, enum: ['education', 'careers','immigration'], default: 'education' },
    path_cat: { type: String, enum: ['K12', 'Degree'], default: 'K12' },
    personality: { type: String, enum: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] },
    destination_degree: { type: String },
    status: { type: String, enum: ['active', 'inactive','delete'], default: 'active' },
    financialSituation: [
        {
            finance: { type: String, enum: ['0-25L', '25L-75L', '75L-3CR', '3CR+', "other"] },
            description: { type: String },
        }
    ],
    curriculum: [
        {
            curriculum: { type: String, enum: ['IB', 'CBSE', 'IG', 'CSE', 'ICSE', 'Nordic'] },
            description: { type: String },
        }
    ],
    grade: [
        {
            grade: { type: String, enum: ['9', '10', '11', '12'] },
            description: { type: String },
        }
    ],
    grade_avg: [
        {
            grade_avg: { type: String, enum: ['0-35', '36-60', '61-75', '76-85','86-95','96-100'] },
            description: { type: String },
        }
    ],
    stream: [
        {
            stream: { type: String, enum: ['MPC', 'BIPC', 'CEC', 'MEC', 'HEC'] },
            description: { type: String },
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('paths', pathSchema);
