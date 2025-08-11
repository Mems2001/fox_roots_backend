const models = require('../../models');

async function findRoleByName(name) {
    return await models.Roles.findOne({
        where: {
            name
        }
    })
}

module.exports = {
    findRoleByName
}