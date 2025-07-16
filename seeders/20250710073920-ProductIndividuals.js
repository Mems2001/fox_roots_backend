'use strict';
const uuid = require('uuid');
const models = require('../models');
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

    const products = await models.Products.findAll();
    const colors = await models.Colors.findAll();
    const sizes = await models.Sizes.findAll();
    const styles = await models.Styles.findAll();

    function getElementId (table, name) {
      for (let e of table) {
        if (e.name === name) {
          return e.id
        }
      }
    }

    const individuals = [
      {
        id: uuid.v4(),
        name: 'test 1',
        description: 'test 1',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'S'),
        style_id: getElementId(styles, 'plain'),
        price: 10
      },
      {
        id: uuid.v4(),
        name: 'test 2',
        description: 'test 2',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        price: 100
      },
      {
        id: uuid.v4(),
        name: 'test 3',
        description: 'test 3',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'M'),
        style_id: getElementId(styles, 'plain'),
        price: 1000
      },
      {
        id: uuid.v4(),
        name: 'test 4',
        description: 'test 4',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'M'),
        style_id: getElementId(styles, 'plain'),
        price: 50
      },
      {
        id: uuid.v4(),
        name: 'test 5',
        description: 'test 5',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'S'),
        style_id: getElementId(styles, 'plain'),
        price: 500
      },
      {
        id: uuid.v4(),
        name: 'test 6',
        description: 'test 6',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        price: 350
      },
    ];

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('product_individuals', individuals, {transaction});

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
      await queryInterface.bulkDelete('product_individuals', {
        id: {
          [Op.ne]: ''
        }
      }, {transaction});

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();

      throw error
    }
  }
};
