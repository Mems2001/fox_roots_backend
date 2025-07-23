const models = require('../../models');
const uuid = require('uuid');
const CartsServices = require('./carts.services');

async function createCartProduct(user_id, individual_id) {
    const transaction = await models.sequelize.transaction()

    try {
        let cart = await CartsServices.findCartByUserId(user_id)
        let newCartProduct

        if (!cart) cart = await CartsServices.createCart(user_id)
        
        newCartProduct = await models.CartProducts.create({
            id: uuid.v4(),
            cart_id: cart.id,
            individual_id,
            quantity: 1
        }, {transaction})

        if (!newCartProduct) return null
        
        await CartsServices.addCartProductToCart(cart.id, individual_id)

        await transaction.commit()

        return {cart, newCartProduct}
    } catch (error) {
        await transaction.rollback()
        const err = {
            message: error.message,
            error
        }
        console.error(err)
        throw err
    }

}

async function findCartProductById(id) {
    return await models.CartProducts.findOne({
        where:{
            id
        }
    })
}

async function addCartProduct(id) {
    const transaction = await models.sequelize.transaction()

    try {
        const cartProduct = await findCartProductById(id)

        if (!cartProduct) return null

        const updatedCartProduct = await cartProduct.update({
            quantity: cartProduct.quantity + 1
        }, {transaction})

        if (!updatedCartProduct) return null

        const updatedCart = await CartsServices.addCartProductToCart(updatedCartProduct.cart_id, cartProduct.individual_id)

        await transaction.commit()

        return {
            updatedCart,
            updatedCartProduct
        }
    } catch(error) {
        await transaction.rollback()
        const err = {
            message: error.message,
            error
        }
        console.error(err)
        throw err
    }
}

module.exports = {
    createCartProduct,
    addCartProduct
}