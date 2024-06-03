module.exports = (sequelize, DataTypes) => {
  const Profil = sequelize.define("Profil", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    organisation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    competence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secteur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Profil.associate = (models) => {
    Profil.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };

  return Profil;
};
