const uuid = require('uuid');
const models = require('../../models');
const { hashPassword } = require('../../utils/bcrypt');

async function createUser({username, email, phone, password}) {
    const userData = {
        id: uuid.v4(),
        username,
        email,
        phone: phone? phone : undefined,
        password: hashPassword(password)
    }

    const transaction = await models.sequelize.transaction()

    try {
        const newUser = await models.Users.create(userData, {transaction})
        await transaction.commit()
        return newUser
    } catch (error) {
        await transaction.rollback()
        console.error('users services:', error)
    }
}

async function getUserByUsername (username) {
    return await models.Users.findOne({
        where: {
            username
        }
    })
}

async function getUserByEmail (email) {
    return await models.Users.findOne({
        where: {
            email
        }
    })
}

async function getUserByPhone (phone) {
    return await models.Users.findOne({
        where: {
            phone
        }
    })
}

async function getUserById(id) {
    return await models.Users.findOne({
        id
    })
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail,
    getUserByPhone,
    getUserById
}