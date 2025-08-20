'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: Sequelize.UUID
        },
        roleId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'role_id',
          references: {
            model: 'roles',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            min: 3
          }
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
          defaultValue: undefined
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'email_verified'
        },
        phoneVerified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'phone_verified'
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
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.dropTable('users', {transaction})

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};