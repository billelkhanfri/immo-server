const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description:
      "Documentation de l'API pour la gestion des utilisateurs et des profils.",
    contact: {
      name: "Support API",
      email: "support@api.com",
    },
  },
  servers: [
    {
      url: "http://192.168.1.11:2000",
      description: "Serveur local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Assure-toi que le chemin vers tes fichiers de routes est correct
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
