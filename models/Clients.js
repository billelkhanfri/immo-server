module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    Client.associate = (models) => {
      Client.hasMany(models.Referral, { foreignKey: 'clientId' });
    };
  
    return Client;
  };
  