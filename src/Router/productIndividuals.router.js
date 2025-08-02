const router = require('express').Router();
const ProductIndividualsControllers = require('../Controllers/productIndividuals.controllers');

router.route('/')
    .get(ProductIndividualsControllers.getAllProductIndividuals)

router.route('/featured')
    .get(ProductIndividualsControllers.getFeaturedIndividuals)

router.route('/:prod_id')
    .get(ProductIndividualsControllers.getProductIndividualByIdWithQueries)

router.route('/search/queries')
    .get(ProductIndividualsControllers.getProductIndividualsByName)

module.exports = router