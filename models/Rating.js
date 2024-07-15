module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      ratingValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      evaluatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeValidate: (rating, options) => {
          if (rating.ratingValue < 1 || rating.ratingValue > 5) {
            throw new Error("le vote doit être entre 1 et 5");
          }
        },
      },
    }
  );
  Rating.associate = (models) => {
       Rating.belongsTo(models.Profile, {
         foreignKey: "profileId",
         as: "profile",
       });

    Rating.belongsTo(models.User, {
      foreignKey: "userId",
      as: "evaluator",
      onDelete: "CASCADE",
    });
  };
  return Rating;
};
