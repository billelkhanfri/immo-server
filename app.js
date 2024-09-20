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
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all methods
  allowedHeaders: "*", // Allow all headers
};

app.use(cors(corsOptions));
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
const ratingsRoutes = require("./routes/ratingsRoutes");
const requestRoutes =  require("./routes/requestRoute")
const attributeRoute = require("./routes/attributesRoute")

// Use routes with prefixes693
app.use("/", userRoutes);
app.use("/", profileRoutes);
app.use("/", referralRoutes);
app.use("/", ratingsRoutes);
app.use("/", requestRoutes);
app.use("/", attributeRoute);


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
  console.log(
    `Swagger docs available at http://${
      process.env.HOST || "localhost"
    }:${PORT}/api-docs`
  );
});
