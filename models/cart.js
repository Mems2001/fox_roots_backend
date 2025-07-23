'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Carts.hasMany(models.CartProducts, {
        foreignKey: 'cart_id'
      })
      Carts.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'User'
      })
    }
  }
  Carts.init({
    user_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER,
    total: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Carts',
    tableName: 'carts'
  });
  return Carts;
};