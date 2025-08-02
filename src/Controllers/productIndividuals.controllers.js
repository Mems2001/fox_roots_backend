const { Op } = require('sequelize');
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

function getProductIndividualsByName(req, res) {
    const {name} = req.query

    ProductIndividualsServices.findProductIndividualsByName(name)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'get product individuals by name controller:',
                message: err.message,
                err
            })
        })
}

function getFeaturedIndividuals(req, res) {
    ProductIndividualsServices.findFeaturedIndividuals()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'get featured individuals controller',
                message: err.message,
                err
            })
        })
}

module.exports = {
    getFeaturedIndividuals,
    getAllProductIndividuals,
    getProductIndividualsByName,
    getProductIndividualByIdWithQueries
}