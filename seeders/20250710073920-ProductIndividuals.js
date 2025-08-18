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
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'S'),
        style_id: getElementId(styles, 'plain'),
        stock: 6,
        price: 10,
        featured_by: 2
      },
      {
        id: uuid.v4(),
        name: 'test 2',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        stock: 7,
        price: 100,
        featured_by: 2
      },
      {
        id: uuid.v4(),
        name: 'test 3',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'M'),
        style_id: getElementId(styles, 'plain'),
        stock: 5,
        price: 1000
      },
      {
        id: uuid.v4(),
        name: 'test 4',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'M'),
        style_id: getElementId(styles, 'plain'),
        stock: 2,
        price: 50,
        featured_by: 1
      },
      {
        id: uuid.v4(),
        name: 'test 5',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'white'),
        size_id: getElementId(sizes, 'S'),
        style_id: getElementId(styles, 'plain'),
        stock: 1,
        price: 500,
        featured_by: 1
      },
      {
        id: uuid.v4(),
        name: 'test 6',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'black'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        stock: 4,
        price: 350
      },
      {
        id: uuid.v4(),
        name: 'test 7',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'buso'),
        color_id: getElementId(colors, 'red'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        stock: 8,
        price: 350,
        featured_by: 3
      },
      {
        id: uuid.v4(),
        name: 'test 8',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'red'),
        size_id: getElementId(sizes, 'L'),
        style_id: getElementId(styles, 'plain'),
        stock: 9,
        price: 35
      },
      {
        id: uuid.v4(),
        name: 'test 9',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'red'),
        size_id: getElementId(sizes, 'S'),
        style_id: getElementId(styles, 'plain'),
        stock: 6,
        price: 70
      },
      {
        id: uuid.v4(),
        name: 'test 10',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet ad unde quis dolores nemo! Eligendi sunt sed eaque dolore, vel accusantium cumque molestias voluptate aliquam quis, possimus in perspiciatis et.',
        product_id: getElementId(products, 'camiseta'),
        color_id: getElementId(colors, 'red'),
        size_id: getElementId(sizes, 'M'),
        style_id: getElementId(styles, 'plain'),
        stock: 7,
        price: 15,
        featured_by: 3
      }
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
