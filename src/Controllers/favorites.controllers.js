const FavoritesService = require('../Services/favorites.services')

function postFavorite(req, res) {
    const user_id = req.session.user.user_id
    const individual_id = req.params.individual_id

    FavoritesService.createFavorite(user_id, individual_id)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
} 

function deleteFavorite(req, res) {
    const user_id = req.session.user.user_id
    const individual_id = req.params.individual_id

    FavoritesService.destroyFavorite(user_id, individual_id)
        .then(data => {
            res.status(204).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'Favorites controllers',
                message: err.message,
                err
            })
        })
}

function getAllFavoritesByUserId(req, res) {
    const user_id = req.session.user.user_id

    FavoritesService.findAllFavoritesByUserId(user_id)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json(null)
        })
        .catch(err => {
            res.status(500).json({
                location: 'Favorites controllers',
                message: err.message,
                err
            })
        })
}

module.exports = {
    postFavorite,
    deleteFavorite,
    getAllFavoritesByUserId
}