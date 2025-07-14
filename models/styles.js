'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Styles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Styles.hasMany(models.ProductIndividuals, {
        foreignKey: 'style_id'
      })
    }
  }
  Styles.init({
    name: DataTypes.STRING,
    image_data: DataTypes.TEXT,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Styles',
    tableName: 'styles'
  });
  return Styles;
};