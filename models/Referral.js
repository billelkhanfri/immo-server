const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define("Referral", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    typeDeReferral: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureDuContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lieu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentaire: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    honnoraire: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: true, // Peut être null initialement
    },
    globalStatus: {
      type: DataTypes.ENUM,
      values: [
        "envoyé",
        "en attente",
        "attribué",
        "pourparlers",
        "mandat",
        "compromis",
        "acte",
       
      ],
      defaultValue: "envoyé",
    },
    clientId: {
      type: DataTypes.UUID,
      references: { model: "Clients", key: "id" },
      allowNull: false,
    },
  });

  Referral.associate = (models) => {
    Referral.belongsTo(models.Client, { foreignKey: "clientId", as: "client" });

    Referral.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
      onDelete: "CASCADE",
    });
    Referral.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
      onDelete: "CASCADE",
    });
    Referral.hasMany(models.ReferralRequest, {
      foreignKey: "referralId",
      as: "receivedRequest",
      onDelete: "CASCADE",
    });

     // New association with ReferralUserStatus
     Referral.hasMany(models.ReferralUserStatus, {
      foreignKey: "referralId",
      as: "userStatuses",
      onDelete: "CASCADE",
    });
  };

  return Referral;
};
