const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const partnerSchema = new mongoose.Schema({
    email: { type: String },
    username: { type: String },
    password: { type: String, required: true },
    userType: { type: String },
    OTP: { type: String },
    OTPCreatedTime: { type: Date },
    OTPAttempts: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    OTPverified: { type: Boolean, default: false },
}, {
    timestamps: true
});


partnerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  

  partnerSchema.methods.matchPassword = async function (receivedPassword) {
    if (!this.password) {
        throw new Error("Stored password is missing");
    }

    console.log("Received password:", receivedPassword); // Debugging log
    console.log("Stored password (hash):", this.password); // Debugging log

    return await bcrypt.compare(receivedPassword, this.password);
};

module.exports = mongoose.model('naavi_partners', partnerSchema);