'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          primaryKey: true,
          unique:true,
          type: Sequelize.UUID
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
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
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('users', {transaction});

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();
      throw error
    }
  }
};