const router = require('express').Router();
const ProductsControllers = require('../Controllers/products.controllers')

router.route('/')
    .get(ProductsControllers.getAllProducts)

module.exports = router