'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('user_tokens', {
        id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: Sequelize.UUID
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        type: {
          type: Sequelize.INTEGER, // 0 -> password reset, 1 -> email verification, 2 -> phone verification
          allowNull: false
        },
        hashedToken: {
          type: Sequelize.STRING,
          allowNull: false,
          field: 'hashed_token'
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
          field: 'expires_at'
        },
        isUsed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_used'
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
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.dropTable('user_tokens', {transaction})

      await transaction.commit()
    } catch(error) {
      await transaction.rollback()
      throw error
    }
  }
};