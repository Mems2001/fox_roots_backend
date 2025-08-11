'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Carts, {
        foreignKey: 'user_id'
      })
      Users.hasMany(models.Favorites, {
        foreignKey: 'user_id'
      })
      Users.belongsTo(models.Roles, {
        foreignKey: 'role_id',
        as: 'Role'
      })
    }
  }
  Users.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    email_verification_token: DataTypes.UUID,
    phone_verified: DataTypes.BOOLEAN,
    phone_verification_token: DataTypes.UUID,
    profile_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password', 'email_verification_token', 'phone_verification_token']
      }
    },
    scopes:{
      withSensitiveData: {
        attributes: {
          include: ['password', 'email_verification_token', 'phone_verification_token']
        }
      }
    }
  });
  return Users;
};