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
          try {
            const ratings = await this.getRatings();
            console.log("Fetched Ratings: ", ratings);
            if (ratings && ratings.length > 0) {
              const total = ratings.reduce(
                (sum, rating) => sum + rating.ratingValue,
                0
              );
              const average = total / ratings.length;
              console.log("Calculated Average Rating: ", average);
              return average;
            } else {
              console.log("No ratings found for profile ID: ", this.id);
              return null;
            }
          } catch (error) {
            console.error(
              "Error fetching ratings for profile ID: ",
              this.id,
              error
            );
            return null;
          }
        },
      },
    },
    {
      hooks: {
        beforeValidate: (profile, options) => {
          if (typeof profile.imageUrl === "string") {
            profile.imageUrl = profile.imageUrl.trim();
          }
          if (typeof profile.competence === "string") {
            profile.competence = profile.competence.trim();
          }
        },
        beforeCreate: async (profile, options) => {
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
