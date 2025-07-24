const CartProductsServices = require('../Services/cartProducts.services')

function postCartProduct(req, res) {
    const user_id = req.session.user.user_id
    const individual_id = req.params.individual_id
    console.log('---> Post cart product controller:', user_id, individual_id)

    CartProductsServices.addCartProduct(user_id, individual_id)
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

function patchCartProduct(req, res) {
    const user_id = req.session.user.user_id
    const individual_id = req.params.individual_id
    console.log('---> Patch cart product controller:', user_id, individual_id)

    CartProductsServices.removeCartProduct(user_id, individual_id)
        .then(data => {
            console.log('---> Patch cart prouct controller response:', data)
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

function getCartProductByIndividualId(req, res) {
    const individual_id = req.params.individual_id

    CartProductsServices.findCartProductByIndividualId(individual_id)
        .then(data => {
            res.status(200).json(data)
            // else res.status(404).json({message:'Cart product not found'})
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

function getCartProductByProductIdAndQueries(req, res) {
    const product_id = req.params.product_id
    const queries = req.query

    CartProductsServices.findCartProductByProductIdAndQueire(product_id, queries)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    postCartProduct,
    patchCartProduct,
    getCartProductByIndividualId,
    getCartProductByProductIdAndQueries
}