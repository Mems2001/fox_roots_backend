const ProductsServices = require('../Services/products.services')

function getAllProducts (req, res) {
    ProductsServices.findAllProducts()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(404).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    getAllProducts
}