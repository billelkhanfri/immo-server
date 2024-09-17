module.exports = (sequelize, DataTypes) => {
  const ReferralUserStatus = sequelize.define("ReferralUserStatus", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
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
    referralId: {
      type: DataTypes.UUID,
      references: {
        model: "Referrals", // Ensure this matches the actual table name
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users", // Ensure this matches the actual table name
        key: "id",
      },
      allowNull: false,
    },
  });

  ReferralUserStatus.associate = (models) => {
    ReferralUserStatus.belongsTo(models.Referral, {
      foreignKey: "referralId",
      as: "referral",
      onDelete: "CASCADE",
    });
    ReferralUserStatus.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return ReferralUserStatus;
};
