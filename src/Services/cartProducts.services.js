const models = require('../../models');
const uuid = require('uuid');
const CartsServices = require('./carts.services');
const ProductIndividualsServices = require('./productIndividuals.services');

async function addCartProduct(user_id, individual_id) {
    const transaction = await models.sequelize.transaction()

    try {
        let cart = await CartsServices.findCartByUserId(user_id)
        let cartProduct = await findCartProductByIndividualId(individual_id)

        if (!cart) cart = await CartsServices.createCart(user_id)

        if (!cartProduct) {
            cartProduct = await models.CartProducts.create({
                id: uuid.v4(),
                cart_id: cart.id,
                individual_id,
                quantity: 1
            }, {transaction})
        } else {
            cartProduct = await cartProduct.update({
                quantity: cartProduct.quantity + 1
            }, {transaction})
        }

        if (!cartProduct) return null
        
        cart = await CartsServices.addCartProductToCart(cart.id, individual_id)

        await transaction.commit()

        return {cart, cartProduct}
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

async function findCartProductByIndividualId(individual_id) {
    return await models.CartProducts.findOne({
        where: {
            individual_id
        }
    })
}

async function findCartProductByProductIdAndQueire(product_id, {color, size, style}) {
    console.log('---> Searching cart product for:', product_id, {color, size, style})

    const individual = await ProductIndividualsServices.findProductIndividualByProductIdWithQueries(product_id, {color, size, style})

    if (!individual) return null

    const cartProduct = await findCartProductByIndividualId(individual.id)

    return cartProduct
} 

module.exports = {
    findCartProductByProductIdAndQueire,
    findCartProductByIndividualId,
    findCartProductById,
    addCartProduct
}