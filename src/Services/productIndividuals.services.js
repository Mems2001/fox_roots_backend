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

async function findProductIndividualsByName(name) {
    const individuals = await models.ProductIndividuals.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            }
        },
        order: [
            ['name', 'ASC']
        ]
    })

    return individuals
}

module.exports = {
    findIndividualById,
    findAllProductIndividuals,
    findProductIndividualsByName,
    findAllProductIndividualsByProductId,
    findProductIndividualByProductIdWithQueries,
    findAllProductIndividualsByProductIdAndColorId
}