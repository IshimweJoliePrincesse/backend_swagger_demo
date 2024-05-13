const express = require("express");
const debug = require("debug")("app:server"); // Import debug module and set namespace
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const userRoutes = require("./routes/userRoutes");
const Joi = require("joi");
const app = express();
const port = 8990;

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use((err, req, res, next) => {
  debug("Error:", err.stack); // Log debug message for errors
  console.error(err.stack);
  res.status(500).send("Something broke");
});

// Start server on port 8990
app.listen(port, () => {
  debug(`Server is running on port ${port}`); // Log debug message for server start
  console.log(`Server is running on port ${port}`);
});
