const ProductIndividualsServices = require('../Services/productIndividuals.services');

function getAllProductIndividuals (req, res) {
    ProductIndividualsServices.findAllProductIndividuals()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({
                message: err.message,
                err
            })
        })
}

function getProductIndividualByIdWithQueries (req, res) {
    const productId = req.params.prod_id
    const queries = req.query;
    console.log('---> Searching for product:', productId)
    console.log('---> queries:', queries)

    ProductIndividualsServices.findProductIndividualByProductIdWithQueries(productId, queries)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json(
                {
                    message: 'Product not found'
                }
            )
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    getAllProductIndividuals,
    getProductIndividualByIdWithQueries
}