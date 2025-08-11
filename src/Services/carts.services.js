const models = require('../../models')
const uuid = require('uuid')
const ProductIndividualsService = require('./productIndividuals.services')

async function createCart(user_id) {
    const transaction = await models.sequelize.transaction()

    try {
        const newCart = await models.Carts.create({
            id: uuid.v4(),
            user_id,
            total: 0
        }, {transaction})

        await transaction.commit()

        return newCart
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function findCartByUserId (user_id) {
    return await models.Carts.findOne({
        where: {
            user_id
        }
    })
}

async function findCartById (id) {
    return await models.Carts.findOne({
        where: {
            id
        }
    })
}

async function addCartProductToCart(cart_id, individual_id) {
    const transaction = await models.sequelize.transaction()
    console.log('---> Adding product to cart:', cart_id, individual_id)

    try {
        const cart = await findCartById(cart_id)
        const individual = await ProductIndividualsService.findIndividualById(individual_id)
        const newTotal = cart.total + individual.price

        if (!cart || !individual) {
            return null
        }

        const newCart = await cart.update({
            quantity: cart.quantity + 1,
            total: newTotal
        }, {transaction})

        await transaction.commit()

        return newCart
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

async function reassingCartByUserId(user_id, cart_id) {
    const transaction = await models.sequelize.transaction()

    try {
        let cart = await findCartById(cart_id)
        cart = await cart.update({
            user_id
        }, {transction})
        await transaction.commit()
        return cart
    } catch (error) {
        await transaction.rollback()
        console.error(error)
        throw error
    }
}

module.exports = {
    createCart,
    findCartByUserId,
    addCartProductToCart,
    reassingCartByUserId
}