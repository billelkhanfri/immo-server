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
      averageRating: {
        type: DataTypes.VIRTUAL,
        async get() {
          const ratings = await this.getRatings(); // Fetch ratings associated with this profile
          if (ratings && ratings.length > 0) {
            const total = ratings.reduce(
              (sum, rating) => sum + rating.ratingValue,
              0
            );
            return total / ratings.length;
          }
          return null;
        },
      },
    },
    {
      hooks: {
        beforeValidate: (profile, options) => {
          // Trim fields before validation
          if (typeof profile.imageUrl === "string") {
            profile.imageUrl = profile.imageUrl.trim();
          }
          if (typeof profile.competence === "string") {
            profile.competence = profile.competence.trim();
          }
        },
        beforeCreate: async (profile, options) => {
          // Set a default 'about' message if not provided
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

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });

    Profile.hasMany(models.Rating, {
      foreignKey: "profileId",
      as: "ratings",
      onDelete: "CASCADE",
    });
  };

  return Profile;
};
