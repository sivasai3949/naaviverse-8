const mongoose = require("mongoose");
const Partner = require("../models/partner.model");
require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const { generateOTP, sendOTP, sendNotificationMail  } = require("../middlewares/verifySignUp");

const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input fields
    if (!email || !username || !password) {
      return res.status(400).json({
        successful: false,
        message: "All fields (email, username, password, role) are required",
      });
    }

    const OTP = generateOTP();
    console.log(`Generated OTP: ${OTP}`);
    const currentTime = new Date();


    // Create a new user (no check for existing username)
    const temporalPartner = new Partner({
      username,
      email,
      password, // Save hashed password
      OTP: OTP,
      isBlocked: false,
      OTPAttempts: 0,
      OTPCreatedTime: currentTime,
      status: false,
    });

    await temporalPartner.save();

    // Send OTP email
    sendNotificationMail(
      email,
      "Naavi Registration Confirmation OTP",
      `Dear Partner,<br>Your OTP: ${OTP}<br>`
    );

    // Generate JWT token
    const oneDayInSeconds = 86400;
    const token = jwt.sign({ id: temporalPartner._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: oneDayInSeconds,
    });

    // Prepare the response user object
    const partner = {
      id: temporalPartner._id,
      username: temporalPartner.username,
      email: temporalPartner.email,
    };

    return res.status(201).json({
      successful: true,
      message: "Partner created successfully",
      token: token,
      partner: Partner,
    });
  } catch (error) {
    console.error("SignUp Error:", error);

    return res.status(500).json({
      successful: false,
      message: "Something went wrong",
    });
  }
};


// const checkDuplicatedEmail = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     console.log("Email check hit:", req.body);
//     if (user)
//       if(user.userType == req.body.role)
//         return res.status(400).json({ message: "The email already exists" });

//     next();
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Something went wrong , signup fail" });
//   }
// };

// const checkDuplicatedUsername = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });
//     if (user)
//       return res.status(400).json({ message: "The username already exists" });
    
//       return res.status(200).json({
//         successful: true,
//         message: "The username valid",
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Something went wrong , signup fail" });
//   }
// };

const forgotPassword = async (req, res) => {
  var partnerFound

  if(typeof(req.body.email) !== "undefined")
      partnerFound = await Partner.findOne({ email: req.body.email });
  
  if (!partnerFound) return res.status(400).json({ message: "User Not Found" });

  const OTP = generateOTP();
  console.log(OTP);
  const currentTime = new Date();
  partnerFound.OTP=OTP;
  partnerFound.OTPCreatedTime=currentTime;

  
  await partnerFound.save();
  sendNotificationMail(req.body.email,"Naavi forgot password OTP", "Dear Partner,<br>Your OTP:"+OTP+" <br>" );
    //sendOTP(req.body.email, OTP);
    console.log(partnerFound._id);
    const oneDayInSeconds = 86400;

    const token = jwt.sign({ id: partnerFound._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: oneDayInSeconds,
    });

  return res.status(200).json({
    success: true,
    token: token,
    message: "OTP sent to your emailId",
  });

};
const sendConfirmationEmail = async (req, res) => {
  try {
    const partnerFound = await TemporalPartner.findOne({ email: req.body.email });

    const token = partnerFound.emailToken;

    const url = `${
      process.env.HOST || "localhost:7000"
    }/api/auth/verification/${token}`;

    await sendConfirmationEmailFunction(url, partnerFound.email);

    return res.status(200).json({
      success: true,
      message: "Account confirmation email has been send successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "something went wrong" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        successful: false,
        message: "Both email and password are required",
      });
    }

    // Find user by email
    const partner = await Partner.findOne({ email });

    if (!partner) {
      return res.status(401).json({
        successful: false,
        message: "Invalid credentials",
      });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await partner.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        successful: false,
        message: "Invalid password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    // Send the response with user data and token
    return res.status(200).json({
      successful: true,
      message: "Login successful",
      token,
      partner: {
        id: partner._id,
        username: partner.username,
        email: partner.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      successful: false,
      message: "Something went wrong",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("delivery-app-session-token");
    return res
      .status(200)
      .json({ successfully: true, message: "partner has logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const sendResetPasswordEmail = async (req, res) => {
  try {
    const partnerFound = await Partner.findOne({ email: req.body.email });

    if (!partnerFound)
      return res.status(422).json({
        successful: false,
        message: "Doesn't exits account link with that email",
      });

    const id = partnerFound._id;

    const token = jwt.sign(
      {
        id,
        expiration: Date.now() + 10 * 60 * 1000,
      },
      process.env.JWT_SECRET_KEY
    );

    const url = `${
      process.env.HOST || "localhost:3000"
    }/#/authentication/resetPassword/${token}`;

    await sendResetPasswordEmailFunction(url, req.body.email);

    return res.status(200).json({
      success: true,
      message: "Reset password email has been send successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      successful: false,
      message: "Something went wrong, fail to to send reset password email",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ successful: false, message: "Passwords don't match" });
    }

    if (newPassword.length < 5) {
      return res
        .status(400)
        .json({ successful: false, message: "Password minimum length is 5" });
    }

    const token = req.params.token;

    if (!token)
      return res
        .status(403)
        .json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_FORGOTTEN_PASSWORD_KEY
    );

    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    if (Date.now() > decoded.expiration) {
      return res.status(422).json({
        successful: false,
        message: "Time to reset password exceeded",
      });
    }

    const partnerFound = await Partner.findById(decoded.id);

    if (!partnerFound) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await Partner.encryptPassword(newPassword);

    partnerFound.password = hashedPassword;

    await partnerFound.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      successful: false,
      message: "Something went wrong, fail to update password",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // Extract email and OTP from body

    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Find user by email
    const partnerFound = await Partner.findOne({ email });
    if (!partnerFound) return res.status(404).json({ message: "partner not found" });

    // Check if OTP matches
    if (otp !== partnerFound.OTP) {
      return res.status(400).json({ successful: false, message: "OTP doesn't match" });
    }

    // Mark OTP as verified
    partnerFound.OTPverified = true;
    await partnerFound.save();

    return res.status(200).json({ success: true, message: "OTP Verified successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ successful: false, message: "Something went wrong during OTP verification" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!token)
      return res
        .status(403)
        .json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const id = decoded.id;

    const partnerFound = await Partner.findById(id);

    if (!partnerFound) return res.status(404).json({ message: "Partner not found" });

    
    partnerFound.password = password;

    await partnerFound.save();

    return res
      .status(200)
      .json({ success: true, message: "Password Updated successfully" });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      successful: false,
      message: "Something went wrong, fail to update password",
    });
  }
};

module.exports = {
  signUp,
  forgotPassword,
  login,
  sendConfirmationEmail,
  sendResetPasswordEmail,
  resetPassword,
  logout,
  verifyOTP,
  updatePassword,
};
