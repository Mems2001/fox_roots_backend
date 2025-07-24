const router = require('express').Router()

const CartsControllers = require('../Controllers/carts.controllers')
const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware')

router.route('/my-cart')
    .get(authenticateSessionMiddleware, CartsControllers.getMyCart)

module.exports = router