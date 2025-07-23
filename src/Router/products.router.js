const router = require('express').Router();
const ProductsControllers = require('../Controllers/products.controllers')

router.route('/')
    .get(ProductsControllers.getAllProducts)

router.route('/:product_id/characteristics')
    .get(ProductsControllers.getProductCharacteristics)

module.exports = router