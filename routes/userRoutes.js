
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../Middleware/authMiddleware");
const login = require("../controllers/authController");
const Joi = require("joi");
const debug = require("debug")("app:userRoutes"); 

// Joi schema for user creation
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Joi schema for user update
const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Middleware to validate request body for creating user
const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    debug("Validation error for creating user:", error.details[0].message); // Log debug message for validation error
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Middleware to validate request body for updating a user
const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    debug("Validation error for updating user:", error.details[0].message); // Log debug message for validation error
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get all users (protected route) // need to have token
router.get("/", verifyToken, userController.getUsers);

// Get user by ID (protected route)
router.get("/:id", verifyToken, userController.getUserById);

// Create user (public route) accessseb by anyone
router.post("/", validateCreateUser, userController.createUser);

// Update user (protected route)
router.put("/:id", verifyToken, validateUpdateUser, userController.updateUser);

// Delete user (protected route)
router.delete("/:id", verifyToken, userController.deleteUser);

// Login route
router.post("/login", login);

module.exports = router;
