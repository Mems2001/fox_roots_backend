const router = require('express').Router();
const ProductsControllers = require('../Controllers/products.controllers')

router.route('/')
    .get(ProductsControllers.getAllProducts)

router.route('/characteristics')
    .get(ProductsControllers.getAllProductCharacteristics)

router.route('/:product_id/characteristics')
    .get(ProductsControllers.getProductCharacteristics)

router.route('/:product_id/:color_id/characteristics')
    .get(ProductsControllers.getProductCharacteristicsByColor)

module.exports = router