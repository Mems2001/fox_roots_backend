'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('product_individuals', {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: Sequelize.UUID
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'product_id'
        },
        colorId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'color_id'
        },
        sizeId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'size_id'
        },
        styleId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'style_id'
        },
        price: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: new Date()
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: 'updated_at',
          defaultValue: new Date()
        }
      }, {transaction});

      await transaction.commit()
    } catch(error) {
      await transaction.rollback();

      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('product_individuals', {transaction});

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();

      throw error
    }
  }
};