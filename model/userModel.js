const Joi = require("joi");
const debug = require("debug")("app:userModel"); // Import debug module and set namespace

//provides the structure of the JSON object to send to the postman/thunderclient
class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

// Joi schema for user model
const createUserSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Validate user against user schema
const validateUser = (user) => {
  const { error, value } = createUserSchema.validate(user);
  if (error) {
    debug("Validation error:", error.details[0].message); // Log debug message for validation error
  }
  return { error, value };
};

(module.exports = User), validateUser;
