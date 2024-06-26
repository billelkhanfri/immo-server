const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const ReferralRequest = sequelize.define("ReferralRequest", {
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
    ReferralRequest.belongsTo(models.Referral, { foreignKey: "referralId" });
    ReferralRequest.belongsTo(models.User, { foreignKey: "requesterId" });
  };

  return ReferralRequest;
};
