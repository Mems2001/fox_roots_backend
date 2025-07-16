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

async function findProductIndividualById (id) {
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
    findAllProductIndividuals,
    findProductIndividualById
}