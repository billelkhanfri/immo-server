const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const db = require("./models");
app.use(bodyParser.json());
const userRoute = require("./routes/userRoute");
const dotenv = require("dotenv");
dotenv.config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Test de la connexion à la base de données
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Synchroniser les modèles avec la base de données
db.sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

// Utilisez le routeur User
app.use("/", userRoute);

// Route pour la documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
