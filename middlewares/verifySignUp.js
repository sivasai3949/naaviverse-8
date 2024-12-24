const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

// Fetch credentials from environment variables
const userEmail = process.env.EMAIL_SERVICE_USER; // Your Gmail address
const userAppPassword = process.env.EMAIL_SERVICE_PASS; // Your generated Google App password

// Set up the SMTP transport for sending emails via Gmail
var gx_transport = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 465, // SSL port for Gmail
  secure: true, // Use SSL
  auth: {
    user: userEmail, // Your Gmail address
    pass: userAppPassword, // Your app-specific password
  },
});

// Generate OTP for verification
const generateOTP = () => {
  const otp = crypto.randomBytes(3).toString("hex"); // 6-digit OTP
  console.log("Generated OTP:", otp);
  return otp;
};

// Send OTP email
const sendOTP = (email, OTP) => {
  const mailOptions = {
    from: `"Naavi App" <${userEmail}>`, // Sender email
    to: email, // Receiver email
    subject: "Your OTP for Naavi",
    text: `Your OTP is: ${OTP}`,
    html: `<p>Your OTP is: <b>${OTP}</b></p>`,
  };

  gx_transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send OTP:", error);
    } else {
      console.log("OTP email sent:", info.response);
    }
  });
};

// Send registration notification email
const sendNotificationMail = (email, subject, message) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"Naavi Support" <${userEmail}>`, // Sender email
      to: email, // Receiver email
      subject: subject || "User Registration Confirmation",
      text: "Notification Email",
      html: `<p>${message}</p>`,
    };

    gx_transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send notification email:", error);
        reject({ status: false, message: "Failed to send email" });
      } else {
        console.log("Notification email sent:", info.response);
        resolve({ status: true, message: "Notification email sent successfully" });
      }
    });
  });
};

// Check if all fields are provided
const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        console.log(`Role ${req.body.roles[i]} does not exist`);
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exist`,
        });
      }
    }
  }
  next();
};

// Signup API to create a user and send OTP for verification
const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Log the received request data
    console.log("Received signUp request:", { email, username, password });

    // Validate input fields
    if (!email || !username || !password) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({
        successful: false,
        message: "All fields (email, username, password) are required",
      });
    }

    const OTP = generateOTP();
    const currentTime = new Date();

    // Log the OTP and user creation details
    console.log("OTP:", OTP);
    console.log("Creating temporal user:", { username, email, currentTime });

    // Create a new user (no check for existing username)
    const temporalUser = new User({
      username,
      email,
      password, // Save hashed password
      OTP: OTP,
      isBlocked: false,
      OTPAttempts: 0,
      OTPCreatedTime: currentTime,
      status: false,
    });

    console.log("Saving temporal user:", temporalUser);
    await temporalUser.save();

    // Send OTP email
    console.log("Sending OTP email...");
    sendNotificationMail(
      email,
      "Naavi Registration Confirmation OTP",
      `Dear User,<br>Your OTP: ${OTP}<br>`
    );

    // Generate JWT token
    const oneDayInSeconds = 86400;
    const token = jwt.sign({ id: temporalUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: oneDayInSeconds,
    });
    console.log("Generated JWT token:", token);

    // Prepare the response user object
    const user = {
      id: temporalUser._id,
      username: temporalUser.username,
      email: temporalUser.email,
    };

    return res.status(201).json({
      successful: true,
      message: "User created successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res.status(500).json({
      successful: false,
      message: "Something went wrong",
    });
  }
};

// OTP verification API
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // Extract email and OTP from body

    // Log the received data
    console.log("Received verifyOTP request:", { email, otp });

    // Check if email and OTP are provided
    if (!email || !otp) {
      console.log("Validation failed: Missing email or OTP");
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Find user by email
    console.log("Finding user by email:", email);
    const userFound = await User.findOne({ email });
    if (!userFound) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (otp !== userFound.OTP) {
      console.log("OTP mismatch");
      return res.status(400).json({ successful: false, message: "OTP doesn't match" });
    }

    // Mark OTP as verified
    console.log("OTP matches, marking as verified");
    userFound.OTPverified = true;
    await userFound.save();

    return res.status(200).json({ success: true, message: "OTP Verified successfully" });
  } catch (err) {
    console.log("Error during OTP verification:", err);
    return res.status(500).json({ successful: false, message: "Something went wrong during OTP verification" });
  }
};

module.exports = { signUp, verifyOTP, sendOTP, generateOTP, sendNotificationMail };
