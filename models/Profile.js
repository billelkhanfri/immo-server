module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      organisation: {
        type: DataTypes.STRING,
        allownull: true,
        validate: {},
      },
      image: {
        type: DataTypes.STRING,
        allownull: true,
        validate: {},
      },
      competence: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {},
      },
      secteur: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {},
      },
    },
    {
      hooks: {
        beforeValidate: (profile, options) => {
          if (typeof profile.organisation === "string") {
            profile.organisation = profile.organisation.trim();
          }
          if (typeof profile.image === "string") {
            profile.image = profile.image.trim();
          }
          if (typeof profile.competence === "string") {
            profile.competence = profile.competence.trim();
          }
          if (typeof profile.secteur === "string") {
            profile.secteur = profile.secteur.trim();
          }
        },
      },
    }
  );

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Profile;
};
