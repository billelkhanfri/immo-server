module.exports = (sequelize, DataTypes) => {
  const ReferralAttributes = sequelize.define("ReferralAttributes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: require("uuid").v4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "accepted", "rejected"],
      defaultValue: "pending",
    },
  });

  ReferralAttributes.associate = (models) => {
    // Relation with Referral
    ReferralAttributes.belongsTo(models.Referral, {
      foreignKey: "referralId",
      as: "referral",
      onDelete: "CASCADE",
    });
    
    // Relation with User as receiver (receivedId)
    ReferralAttributes.belongsTo(models.User, {
      foreignKey: "receivedId",
      as: "received",
      onDelete: "CASCADE",
    });

    // Relation with User as sender (senderId)
    ReferralAttributes.belongsTo(models.User, {
      foreignKey: "senderId", // Foreign key pointing to User who created the referral
      as: "sender",
      onDelete: "CASCADE",
    });
  };

  return ReferralAttributes;
};
