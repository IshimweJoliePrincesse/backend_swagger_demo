const jwt = require("jsonwebtoken");
const Joi = require("joi");
const debug = require("debug")("app:authController"); // Import debug module and set namespace
const secretKey = "Ishimwe";

// Dummy user database
const users = [
  { id: 1, username: "Kevine", password: "Akayo" },
  { id: 2, username: "Princesse", password: "Keren" },
];

// Joi schema for verifying login credentials
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Login function
const login = (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      debug("Validation error:", error.details[0].message); // Log debug message for validation error
      return res.status(400).json({ error: error.details[0].message });
    }
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      debug("Invalid username or password"); // Log debug message for invalid username or password
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    debug("Error logging in:", error.message); // Log debug message for login error
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = login;
