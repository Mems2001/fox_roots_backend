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

async function findUserByUsername (username) {
    return await models.Users.findOne({
        where: {
            username
        }
    })
}

async function findUserByEmail (email) {
    return await models.Users.findOne({
        where: {
            email
        }
    })
}

async function findUserByPhone (phone) {
    return await models.Users.findOne({
        where: {
            phone
        }
    })
}

async function findUserById(id) {
    return await models.Users.findOne({
        where: {
            id
        }
    })
}

async function updateUserById(id, {username, email, phone}) {
    const transaction = await models.sequelize.transaction()
    try {
        const user = await models.Users.findOne({
            where: {
                id
            }
        })

        if (!user) {
            return null
        }

        const updatedUser = await user.update({
            username: username? username : user.username,
            email: email? email : user.email,
            phone: phone? phone : user.phone
        }, {transaction})

        await transaction.commit()
    
        return updatedUser
    } catch (error) {
        await transaction.rollback()
        console.error('users services:', error)
        return null
    }
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    findUserByPhone,
    findUserById,
    updateUserById
}