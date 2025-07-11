'use strict';
const { Op } = require('sequelize');
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const styles = [
      {
        id: uuid.v4(),
        name: 'plain',
        image_data: '',
        price: 0
      }
    ];

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('styles', styles, {transaction});

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();

      throw error
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('styles', {
        name: {
          [Op.ne]: ''
        }
      }, {transaction});

      await transaction.commit()
    } catch(error) {
      await transaction.rollback();

      throw error
    }
  }
};
