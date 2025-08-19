'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users, {
        as: 'User',
        foreignKey: 'user_id'
      })

      Profiles.addScope('defaultScope', {
        include: [
          {
            model: sequelize.models.Users,
            as: 'User',
            attributes: {
              exclude: ['password', 'email_verification_token', 'phone_verification_token', 'role_id']
            }
          }
        ]
      })
    }
  }
  Profiles.init({
    user_id: DataTypes.UUID,
    username: DataTypes.STRING,
    profile_image: DataTypes.TEXT,
    address: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING,
    residence_number: DataTypes.STRING,
    residence_description: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'Profiles',
    tableName: 'profiles'
  });
  return Profiles;
};