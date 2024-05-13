const Joi = require("joi");
const User = require("../model/userModel");
const debug = require("debug")("app:userController");

const users = [];

//user creation credentials
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
//user update credentials
const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

//function to get all users
function getUsers(req, res) {
  res.json(users);
}

//function to get user by their id
function getUserById(req, res) {
  const { id } = req.params;
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }
  res.json(user);
}

//function to create a new user
function createUser(req, res) {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      debug("Validation error during user creation:", error.message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = req.body;
    const id = users.length + 1;
    const newUser = new User(id, username, password);
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    debug("Error creating user:", error);
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server Error" });
  }
}

//function to upadate a created user

function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      debug("Validation error during user update:", error.message);
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = users.find((u) => u.id === parseInt(id));
    if (!user) {
      debug("User not found during update");
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username;
    user.password = password;
    res.json(user);
  } catch (error) {
    debug("Error updating user:", error);
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//function to delete user
function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const index = users.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
      debug("User not found during delete");
      return res.status(404).json({ message: "User not found" });
    }
    users.splice(index, 1);
    res.status(204).end();
  } catch (error) {
    debug("Error deleting user:", error);
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//exporting the functions

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
