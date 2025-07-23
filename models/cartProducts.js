'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartProducts.belongsTo(models.Carts, {
        foreignKey: 'cart_id',
        as: 'Cart'
      })
      CartProducts.belongsTo(models.ProductIndividuals, {
        foreignKey: 'individual_id',
        as: 'Individual'
      })
    }
  }
  CartProducts.init({
    cart_id: DataTypes.UUID,
    individual_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartProducts',
    tableName: 'cart_products'
  });
  return CartProducts;
};