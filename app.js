const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const db = require("./models");
app.use(bodyParser.json());
const userRoute = require("./routes/userRoute");
const dotenv = require("dotenv");
dotenv.config();

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

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server running on Port ", PORT));
