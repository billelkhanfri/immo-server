const express = require("express");

const Joi = require("joi");

const app = express();

app.use(express.json());

const users = [
  {
    id: 1,
    first_name: "Dew",
    last_name: "Hayth",
    email: "dhayth0@purevolume.com",
    password: "$2a$04$H/6DC4JuPdwdTemvj75LuOuG5VzpGONLd0t7netP7HHCk.KdWNUCa",
    cpi: "1536531901",
    organisation: "Leenti",
    secteur: "53 Vernon Lane",
    image: "-$1.00",
    competence: "FTK",
  },
  {
    id: 2,
    first_name: "Coletta",
    last_name: "Frunks",
    email: "cfrunks1@studiopress.com",
    password: "$2a$04$zL7xd2y..63GEhgEwPQoCeyxoMgBPwZjgoEXA30ChMUNIxIf.LhNq",
    cpi: "7022602131",
    organisation: "Trilith",
    secteur: "819 Northview Point",
    image: ",。・:*:・゜’( ☻ ω ☻ )。・:*:・゜’",
    competence: "Fashion Design",
  },
  {
    id: 3,
    first_name: "Robbin",
    last_name: "Busfield",
    email: "rbusfield2@illinois.edu",
    password: "$2a$04$7fPqgar3D/BMINgTrJbKN.a/Gls55H0aX0S0d66Zsw4CvDmTB3.W2",
    cpi: "8822182715",
    organisation: "Voomm",
    secteur: "309 Grayhawk Hill",
    image: "!@#$%^&*()",
    competence: "DC Drives",
  },
  {
    id: 4,
    first_name: "Jakie",
    last_name: "Grovier",
    email: "jgrovier3@irs.gov",
    password: "$2a$04$fxAnFvEUd08a54vcCZF.IeLS19QTqBx4u/KFHV3v0C8ijg6R0DE2q",
    cpi: "8713326880",
    organisation: "Zoombox",
    secteur: "82 Chive Parkway",
    image: "Ω≈ç√∫˜µ≤≥÷",
    competence: "MD5",
  },
  {
    id: 5,
    first_name: "Katti",
    last_name: "Standish",
    email: "kstandish4@google.nl",
    password: "$2a$04$gMPr8NVQdgW1E/S51.hIaOVDk8lj4hHf0tWZq0qBsylzVxl4JcWYK",
    cpi: "7642040075",
    organisation: "Cogilith",
    secteur: "10430 Victoria Place",
    image: "😍",
    competence: "Website Development",
  },
];

app.get("/api/user", (req, res) => {
  res.status(200).json(users);
});

app.get("/api/user/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));

  if (!user) {
    res.status(404).json({ mesage: "Utlisateur non trouver" });
  }
  res.status(200).json(user);
});

app.post("/api/user", (req, res) => {
  console.log(req.body);
  const user = {
    id: users.length + 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    cpi: req.body.cpi,
    organisation: req.body.organisation,
    secteur: req.body.secteur,
    image: req.body.image,
    competence: req.body.competence,
  };
  res.status(201).json(user);
});

const PORT = 2000;

app.listen(PORT, () => console.log("server running on Port ", PORT));
