const models = require('../../models');

async function findAllProductIndividuals () {
    return await models.ProductIndividuals.findAll({
        include: [
            {
                model: models.Products,
                as: 'Product'
            },
            {
                model: models.Colors,
                as: 'Color'
            },
            {
                model: models.Sizes,
                as: 'Size'
            }, 
            {
                model: models.Styles,
                as: 'Style'
            }
        ]
    })
}

async function findAllProductIndividualsByProductId (product_id) {
    return await models.ProductIndividuals.findAll({
        where:{
            product_id
        },
        include: [
            {
                model: models.Products,
                as: 'Product'
            },
            {
                model: models.Colors,
                as: 'Color'
            },
            {
                model: models.Sizes,
                as: 'Size'
            }, 
            {
                model: models.Styles,
                as: 'Style'
            }
        ]
    })
}

async function findAllProductIndividualsByProductIdAndColorId (product_id, color_id) {
    return await models.ProductIndividuals.findAll({
        where:{
            product_id,
            color_id
        },
        include: [
            {
                model: models.Products,
                as: 'Product'
            },
            {
                model: models.Colors,
                as: 'Color'
            },
            {
                model: models.Sizes,
                as: 'Size'
            }, 
            {
                model: models.Styles,
                as: 'Style'
            }
        ]
    })
}

async function findProductIndividualByProductIdWithQueries (product_id, {color, size, style}) {
    return await models.ProductIndividuals.findOne({
        where: {
            product_id,
            color_id: color,
            size_id: size,
            style_id: style
        },
        include: [
            {
                model: models.Products,
                as: 'Product'
            },
            {
                model: models.Colors,
                as: 'Color'
            },
            {
                model: models.Sizes,
                as: 'Size'
            }, 
            {
                model: models.Styles,
                as: 'Style'
            }
        ]
    })
}

async function findIndividualById (id) {
    return await models.ProductIndividuals.findOne({
        where: {
            id
        },
        include: [
            {
                model: models.Products,
                as: 'Product'
            },
            {
                model: models.Colors,
                as: 'Color'
            },
            {
                model: models.Sizes,
                as: 'Size'
            }, 
            {
                model: models.Styles,
                as: 'Style'
            }
        ]
    })
}

module.exports = {
    findIndividualById,
    findAllProductIndividuals,
    findAllProductIndividualsByProductId,
    findProductIndividualByProductIdWithQueries,
    findAllProductIndividualsByProductIdAndColorId
}