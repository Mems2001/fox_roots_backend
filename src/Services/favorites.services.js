const models = require('../../models')
const uuid = require('uuid')

async function createFavorite(user_id, individual_id) {
    const transaction = await models.sequelize.transaction()

    try {
        const favorite = await models.Favorites.create({
            id: uuid.v4(),
            user_id,
            individual_id
        }, {transaction})

        await transaction.commit()

        return favorite
    } catch (error) {
        await transaction.rollback()
        console.error(error)
        throw error
    }
}

async function destroyFavorite(user_id, individual_id) {
    const transaction = await models.sequelize.transaction()

    try {
        const favorite = await models.Favorites.findOne({
            where: {
                user_id,
                individual_id
            }
        })

        await favorite.destroy({transaction})
        
        await transaction.commit()
    } catch(error) {
        await transaction.rollback()
        throw error
    }
}

async function findAllFavoritesByUserId(user_id) {
    try {
        return await models.Favorites.findAll({
            where: {
                user_id
            }
        })
    } catch(error) {
        console.error(error)
    }
}

module.exports = {
    createFavorite,
    destroyFavorite,
    findAllFavoritesByUserId
}