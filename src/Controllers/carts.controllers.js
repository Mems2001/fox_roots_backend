const CartsServices = require('../Services/carts.services')

function getMyCart(req, res) {
    const user_id = req.session.user.user_id

    CartsServices.findCartByUserId(user_id)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    getMyCart
}