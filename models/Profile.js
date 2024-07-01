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
        defaultValue: "",
      },
    },
    {
      hooks: {
        beforeValidate: (profile, options) => {
          // Trim des champs avant validation
          if (typeof profile.imageUrl === "string") {
            profile.imageUrl = profile.imageUrl.trim();
          }
          if (typeof profile.competence === "string") {
            profile.competence = profile.competence.trim();
          }
        },
        beforeCreate: async (profile, options) => {
          // Ajout d'un message par défaut pour le champ 'about' si non fourni
          if (!profile.about) {
            const user = await profile.getUser();
            if (user) {
              profile.about = `Bonjour, je suis ${user.firstName}, agent de referral immobilier de ${user.secteur}, France. Connectez-vous avec moi pour construire un réseau de partenaires et échanger des referrals.`;
            }
          }
        },
      },
    }
  );

  // Association avec le modèle 'User'
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Profile;
};
