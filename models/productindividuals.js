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
      ProductIndividuals.hasMany(models.CartProducts, {
        foreignKey: 'individual_id'
      })
      ProductIndividuals.hasMany(models.Favorites, {
        foreignKey: 'individual_id'
      })
      ProductIndividuals.belongsTo(models.Products, {
        foreignKey: 'product_id',
        as: 'Product'
      })
      ProductIndividuals.belongsTo(models.Colors, {
        foreignKey: 'color_id',
        as: 'Color'
      })
      ProductIndividuals.belongsTo(models.Sizes, {
        foreignKey: 'size_id',
        as: 'Size'
      })
      ProductIndividuals.belongsTo(models.Styles, {
        foreignKey: 'style_id',
        as: 'Style'
      })

      ProductIndividuals.addScope('defaultScope', {
        include: [
          {
            model: sequelize.models.Products,
            as: 'Product'
          },
          {
            model: sequelize.models.Colors,
            as: 'Color'
          },
          {
            model: sequelize.models.Sizes,
            as: 'Size'
          }, 
          {
            model: sequelize.models.Styles,
            as: 'Style'
          }
        ]
      })
    }
  }
  ProductIndividuals.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    product_id: DataTypes.UUID,
    color_id: DataTypes.UUID,
    size_id: DataTypes.UUID,
    style_id: DataTypes.UUID,
    stock: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    rating: DataTypes.DOUBLE,
    featured_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductIndividuals',
    tableName: 'product_individuals',
  });
  return ProductIndividuals;
};