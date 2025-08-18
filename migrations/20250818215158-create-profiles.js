'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('profiles', {
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
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            min: 3
          }
        },
        profileImage: {
          type: Sequelize.STRING,
          allowNull: true,
          field: 'profile_image'
        },
        address: {
          type: Sequelize.STRING,
          allowNull: true
        },
        lat: {
          type: Sequelize.STRING,
          allowNull: true
        },
        long: {
          type: Sequelize.STRING,
          allowNull: true
        },
        residenceNumber: {
          type: Sequelize.STRING,
          allowNull: true,
          field: 'residence_number'
        },
        residenceDescription: {
          type: Sequelize.STRING,
          allowNull: true,
          field: 'residence_description'
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
      }, {transaction})

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.dropTable('profiles', {transaction});

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};