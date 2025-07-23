const router = require('express').Router()

const CartProductsControllers = require('../Controllers/cartProducts.controllers')
const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware')

router.route('/add/:individual_id')
    .post(authenticateSessionMiddleware, CartProductsControllers.postCartProduct)

module.exports = router