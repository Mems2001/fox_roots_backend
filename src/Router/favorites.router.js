const FavoritesControllers = require('../Controllers/favorites.controllers')
const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware')
const router = require('express').Router()

router.route('/')
    .get(authenticateSessionMiddleware, FavoritesControllers.getAllFavoritesByUserId)

router.route('/:individual_id')
    .post(authenticateSessionMiddleware, FavoritesControllers.postFavorite)
    .delete(authenticateSessionMiddleware, FavoritesControllers.deleteFavorite)

module.exports = router