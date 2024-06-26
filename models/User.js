// User.js
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le nom ne peut pas être vide",
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le prénom ne peut pas être vide",
          },
        },
      },
      organisation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Doit être une adresse email valide",
          },
          notEmpty: {
            msg: "L'email ne peut pas être vide",
          },
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Le téléphone ne peut pas être vide",
          },
          len: {
            args: [10, 15],
            msg: "Le numéro de téléphone doit être compris entre 10 et 15 caractères",
          },
          isNumeric: {
            msg: "Le numéro de téléphone doit contenir uniquement des chiffres",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le mot de passe ne peut pas être vide",
          },
          len: {
            args: [8], // Minimum 8 characters
            msg: "Le mot de passe doit avoir au moins 8 caractères",
          },
        },
      },

      secteur: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le CPI ne peut pas être vide",
          },
          len: {
            args: [6], // Minimum 6 characters
            msg: "Le CPI doit avoir au moins 6 caractères",
          },
        },
      },
      termsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      hooks: {
        beforeValidate: (user, options) => {
          if (typeof user.lastName === "string") {
            user.lastName = user.lastName.trim();
          }
          if (typeof user.firstName === "string") {
            user.firstName = user.firstName.trim();
          }
          if (typeof user.email === "string") {
            user.email = user.email.trim();
          }
          if (typeof user.password === "string") {
            user.password = user.password.trim();
          }
          if (typeof user.cpi === "string") {
            user.cpi = user.cpi.trim();
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: "userId",
      as: "Profile",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Post, {
      foreignKey: "userId",
      as: "Posts",
      onDelete: "CASCADE",
    });
  };

  return User;
};
