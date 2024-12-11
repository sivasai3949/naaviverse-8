const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    postalCode: { type: String },
    profilePicture: { type: String },
    username: { type: String },
    password: { type: String, required: true },
    userType: { type: String },
    phoneNumber: { type: String },
    financialSituation: { type: String },
    school: { type: String },
    performance: { type: String },
    curriculum: { type: String },
    stream: { type: String },
    grade: { type: String },
    OTP: { type: String },
    OTPCreatedTime: { type: Date },
    OTPAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    OTPverified: { type: Boolean, default: false },
    blockUntil: { type: Date },
    linkedin: { type: String },
    user_level: {type: Number},
    personality: { type: String, enum: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] },
    status: { type: String, enum: ['active', 'inactive','false'], default: 'false' },
}, {
    timestamps: true
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  

  userSchema.methods.matchPassword = async function (receivedPassword) {
    if (!this.password) {
        throw new Error("Stored password is missing");
    }

    console.log("Received password:", receivedPassword); // Debugging log
    console.log("Stored password (hash):", this.password); // Debugging log

    return await bcrypt.compare(receivedPassword, this.password);
};

module.exports = mongoose.model('naavi_users', userSchema);