const jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtAuthMiddleware = (req, res, next) => {

  // first check request headers authorization or not 

  const authorization = req.headers.authorization;

  if(!authorization){
    res.status(401).json({error: "Token Not Found"})
  }

  // Extract jwt token from request headers and verify it
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object and send to the server
    req.jwtPayload = decoded;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT Token

const generateToken = (userData) => {
  // Generate a new JWT token using user data

  // This token will be expired in 30000 seconds
  return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
};

module.exports = { jwtAuthMiddleware, generateToken };
