'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sizes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sizes.hasMany(models.ProductIndividuals, {
        foreignKey: 'size_id'
      })
    }
  }
  Sizes.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sizes',
    tableName: 'sizes'
  });
  return Sizes;
};