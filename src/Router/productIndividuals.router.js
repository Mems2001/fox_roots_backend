const router = require('express').Router();
const ProductIndividualsControllers = require('../Controllers/productIndividuals.controllers');

router.route('/')
    .get(ProductIndividualsControllers.getAllProductIndividuals)

router.route('/:prod_id')
    .get( ProductIndividualsControllers.getProductIndividualByIdWithQueries)

module.exports = router