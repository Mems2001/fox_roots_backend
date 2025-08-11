'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorites.belongsTo(models.ProductIndividuals, {
        as: 'Individual',
        foreignKey: 'individual_id'
      })
      Favorites.belongsTo(models.Users, {
        as: 'User',
        foreignKey: 'user_id'
      })

      Favorites.addScope('defaultScope', {
        include: [
          {
            model: sequelize.models.ProductIndividuals,
            as: 'Individual'
          }
        ]
      })
    }
  }
  Favorites.init({
    individual_id: DataTypes.UUID,
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Favorites',
    tableName: 'favorites'
  });
  return Favorites;
};