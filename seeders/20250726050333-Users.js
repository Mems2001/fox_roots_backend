'use strict';

const rolesServices = require('../src/Services/roles.services')
const uuid = require('uuid');
const { hashPassword } = require('../utils/bcrypt');
const { Op } = require('sequelize');

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
   const admin = await rolesServices.findRoleByName('ADMIN').catch(error => console.error(error))

    const users = [
      {
        id: uuid.v4(),
        role_id: admin.id,
        username: 'mems2001',
        password: hashPassword('1234'),
        email: 'mems2001code@gmail.com'
      }
    ]

    const profiles = [
      {
        id: uuid.v4(),
        user_id: users[0].id,
        username: users[0].username
      }
    ]

    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('users', users, {transaction})
      await queryInterface.bulkInsert('profiles', profiles, {transaction})

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log({
        message: error.message,
        error
      })
      throw {
        message: error.message,
        error
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const transaction = await queryInterface.sequelize.transaction()

    try {
       await queryInterface.bulkDelete('users', {
        where: {
          id: {
            [Op.ne] : ''
          }
        }
      } , {transaction})
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log({
        message: error.message,
        error
      })
      throw {
        message: error.message,
        error
      }
    }
  }
};
