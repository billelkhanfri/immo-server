module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      competence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      about: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeValidate: (profile, options) => {
          if (typeof profile.organisation === "string") {
            profile.organisation = profile.organisation.trim();
          }
          if (typeof profile.imageUrl === "string") {
            profile.imageUrl = profile.imageUrl.trim();
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
