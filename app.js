const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const db = require("./models");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Database connection test
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Synchronize models with database
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

// Import routes
const userRoutes = require("./routes/userRoute");
const profileRoutes = require("./routes/profileRoute");
const referralRoutes = require("./routes/referralRoute");

// Use routes with prefixes
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", referralRoutes);

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
