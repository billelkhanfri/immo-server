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
    commentaire: {
      type: DataTypes.TEXT,
    },
    honnoraire: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    honnoraireConfere: {
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
    status: {
      type: DataTypes.ENUM,
      values: ["open", "assigned", "in_progress", "completed"],
      defaultValue: "open",
    },
  });

  Referral.associate = (models) => {
    Referral.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
    Referral.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
    });
    Referral.hasMany(models.ReferralRequest, {
      foreignKey: "referralId",
      as: "referralRequests",
    });
  };

  return Referral;
};
