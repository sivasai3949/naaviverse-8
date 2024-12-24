const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check if the token is provided in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Log the token for debugging
    }

    // If no token is found, return an error response
    if (!token) {
      console.log("No token provided"); // Log missing token
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded); // Log the decoded token

    req.userId = decoded.id;

    // Fetch user details based on the decoded user ID
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("No user found with the given ID"); // Log when user is not found
      return res.status(404).json({ message: "No user found" });
    }

    // Attach the user to the request object for use in the controller
    req.user = user;

    // Check if user is active (this can be useful in certain operations like reset password)
    if (user.status !== 'active') {
      console.log("User is not active");
      return res.status(403).json({ message: "User is not active" });
    }

    // Log user details for debugging
    console.log("User found:", user); // Log user details

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.log("Error in token verification:", err); // Log any errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  verifyToken,
};
