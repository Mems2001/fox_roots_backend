'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTokens.belongsTo(models.Users, {
        as: 'User',
        foreignKey: 'user_id'
      })
    }
  }
  UserTokens.init({
    user_id: DataTypes.UUID,
    type: DataTypes.INTEGER,
    hashed_token: DataTypes.STRING,
    expires_at: DataTypes.DATE,
    is_used: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserTokens',
    tableName: 'user_tokens'
  });
  return UserTokens;
};