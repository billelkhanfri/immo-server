const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      typeDeReferral: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le type de référé ne peut pas être vide",
          },
        },
      },
      natureDuContact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "La nature du contact ne peut pas être vide",
          },
        },
      },
      commentaire: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      honnoraire: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "Le pourcentage d'honoraire pour l'agent 1 doit être un nombre décimal",
          },
          min: {
            args: [0],
            msg: "Le pourcentage d'honoraire pour l'agent 1 doit être au moins 0",
          },
          max: {
            args: [100],
            msg: "Le pourcentage d'honoraire pour l'agent 1 ne doit pas dépasser 100",
          },
        },
      },
      honnoraireConfere: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: "Le pourcentage d'honoraire pour l'agent 2 doit être un nombre décimal",
          },
          min: {
            args: [0],
            msg: "Le pourcentage d'honoraire pour le confrére doit être au moins 0",
          },
          max: {
            args: [100],
            msg: "Le pourcentage d'honoraire pour le confrére ne doit pas dépasser 100",
          },
        },
      },
    },
    {
      hooks: {
        beforeValidate: (post, options) => {
          if (typeof post.typeDeReferral === "string") {
            post.typeDeReferai = post.typeDeReferai.trim();
          }
          if (typeof post.natureDuContact === "string") {
            post.natureDuContact = post.natureDuContact.trim();
          }
          if (typeof post.commentaire === "string") {
            post.commentaire = post.commentaire.trim();
          }
        },
      },
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Post;
};


