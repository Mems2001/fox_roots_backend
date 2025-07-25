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

function getProductCharacteristics (req, res) {
    const id = req.params.product_id
    // console.log('---> Getting characteritics for:', id)

    ProductsServices.findProductCharacteristics(id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

function getProductCharacteristicsByColor (req, res) {
    const product_id = req.params.product_id
    const color_id = req.params.color_id
    // console.log('---> Getting characteritics for:', product_id, color_id)

    ProductsServices.findProductCharacteristicsByColor(product_id, color_id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    getAllProducts,
    getProductCharacteristics,
    getProductCharacteristicsByColor
}