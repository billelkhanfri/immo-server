const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const ReferralAttributes = sequelize.define("ReferralAttributes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "accepted", "rejected"],
      defaultValue: "pending",
    },
  });

  ReferralRequest.associate = (models) => {
    ReferralAttributes.belongsTo(models.Referral, {
      foreignKey: "referralId",
      as: "referral",
      onDelete: "CASCADE",
    });
    ReferralAttributes.belongsTo(models.User, {
      foreignKey: "receivedId",
      as: "received",
      onDelete: "CASCADE",
    });
  };

  return ReferralAttributes;
};
