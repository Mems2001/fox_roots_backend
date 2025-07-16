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

function getProductIndividualById (req, res) {
    ProductIndividualsServices.findProductIndividualById(req.params.prod_ind_id)
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

module.exports = {
    getAllProductIndividuals,
    getProductIndividualById
}