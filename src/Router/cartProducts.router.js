const router = require('express').Router()

const CartProductsControllers = require('../Controllers/cartProducts.controllers')
const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware')

router.route('/with-queries/:product_id')
    .get(CartProductsControllers.getCartProductByProductIdAndQueries)

router.route('/add/:individual_id')
    .post(authenticateSessionMiddleware, CartProductsControllers.postCartProduct)

router.route('/:individual_id')
    .get(CartProductsControllers.getCartProductByIndividualId)

module.exports = router