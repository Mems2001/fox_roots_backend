'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductIndividuals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductIndividuals.init({
    product_id: DataTypes.UUID,
    color_id: DataTypes.UUID,
    size_id: DataTypes.UUID,
    style_id: DataTypes.UUID,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'ProductIndividuals',
    tableName: 'product_individuals'
  });
  return ProductIndividuals;
};