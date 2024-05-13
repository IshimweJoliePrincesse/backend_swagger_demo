const jwt = require("jsonwebtoken");
const Joi = require("joi");
const debug = require("debug")("app:authMiddleware"); // Import debug module and set namespace
const secretKey = "Ishimwe";

// Joi schema for token validation
const tokenSchema = Joi.string()
  .trim()
  .pattern(/^Bearer\s\S+$/)
  .required();


//function to verify whether the token for authorization is valid
function verifyToken(req, res, next) {
  // Verify token format using Joi
  const { error } = tokenSchema.validate(req.headers.authorization);
  if (error) {
    debug("Invalid token format:", error.details[0].message); // Log debug message for invalid token format
    return res.status(403).json({ message: "Invalid token format" });
  }

  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      debug("Invalid token:", err.message); // Log debug message for invalid token
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}
//exporting the verifyToken function

module.exports = verifyToken;
