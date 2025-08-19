const models = require('../../models')

async function findProfileByUserId (user_id) {
    return await models.Profiles.findOne({
        where: {
            user_id
        }
    })
}

module.exports = {
    findProfileByUserId
}