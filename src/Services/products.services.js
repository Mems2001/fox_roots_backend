const Models = require('../../models')

async function findAllProducts () {
        return await Models.Products.findAll()
}

module.exports = {
    findAllProducts
}
