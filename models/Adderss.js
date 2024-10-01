const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le nom de la rue ne peut pas être vide",
        },
      },
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le code postal ne peut pas être vide",
        },
        len: {
          args: [5, 5], // Le code postal en France fait généralement 5 chiffres
          msg: "Le code postal doit contenir exactement 5 chiffres",
        },
        isNumeric: {
          msg: "Le code postal doit être numérique",
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La ville ne peut pas être vide",
        },
      },
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true, // Champ optionnel
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "France", // Valeur par défaut
      validate: {
        notEmpty: {
          msg: "Le pays ne peut pas être vide",
        },
        isIn: {
          args: [['France']],
          msg: "Le pays doit être la France",
        },
      },
    },
  
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Address;
};
