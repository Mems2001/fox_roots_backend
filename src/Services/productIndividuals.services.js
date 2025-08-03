const { Op } = require('sequelize');
const models = require('../../models');

async function findAllProductIndividuals () {
    return await models.ProductIndividuals.findAll()
}

async function findAllProductIndividualsByProductId (product_id) {
    return await models.ProductIndividuals.findAll({
        where:{
            product_id
        }
    })
}

async function findAllProductIndividualsByProductIdAndColorId (product_id, color_id) {
    return await models.ProductIndividuals.findAll({
        where:{
            product_id,
            color_id
        }
    })
}

async function findProductIndividualByProductIdWithQueries (product_id, {color, size, style}) {
    return await models.ProductIndividuals.findOne({
        where: {
            product_id,
            color_id: color,
            size_id: size,
            style_id: style
        }
    })
}

async function findIndividualById (id) {
    return await models.ProductIndividuals.findOne({
        where: {
            id
        }
    })
}

async function findFilteredInidividuals ({products, colors, sizes, styles}, name) {
    const where = {}

    if (products.length > 0) {
        where.product_id = {[Op.in]: products}
    }
    if (colors.length > 0) {
        where.color_id = {[Op.in]: colors}
    }
    if (sizes.length > 0) {
        where.size_id = {[Op.in]: sizes}
    }
    if (styles.length > 0) {
        where.style_id = {[Op.in]: styles}
    }
    if (name && name.trim() !== '') {
        where.name = {[Op.iLike]: `%${name}%`}
    }

    const response = await models.ProductIndividuals.findAll({
        where,
        order: [
            ['name', 'ASC']
        ]
    })
    
    return response
}

async function findFeaturedIndividuals() {
    return await models.ProductIndividuals.findAll({
        where: {
            featured_by: {
                [Op.gt]: 0
            }
        },
        order: [
            ['name', 'ASC']
        ]
    })
}

module.exports = {
    findIndividualById,
    findFeaturedIndividuals,
    findFilteredInidividuals,
    findAllProductIndividuals,
    findAllProductIndividualsByProductId,
    findProductIndividualByProductIdWithQueries,
    findAllProductIndividualsByProductIdAndColorId
}