const CartProductsServices = require('../Services/cartProducts.services')

function postCartProduct(req, res) {
    const user_id = req.session.user.user_id
    const individual_id = req.params.individual_id

    CartProductsServices.createCartProduct(user_id, individual_id)
        .then(data => {
            if (data) res.status(201).json(data)
            else res.status(400).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    postCartProduct
}