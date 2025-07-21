const uuid = require('uuid');
const models = require('../../models');
const { hashPassword } = require('../../utils/bcrypt');
const { sendTestEmail, sendEmail } = require('../../utils/mailer');

async function createUser({username, email, phone, password}) {
    const userData = {
        id: uuid.v4(),
        username,
        email,
        email_verification_token: uuid.v4(),
        phone: phone? phone : undefined,
        phone_verification_token: uuid.v4(),
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

async function findUserByEmailToken(email_verification_token) {
    return await models.Users.findOne({
        where: {
            email_verification_token
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

        //We check if email or phone are going to change, if so, we generate new verification tokens
        let newEmailToken = user.email_verification_token
        let newPhoneToken = user.phone_verification_token
        let newEmailVerified = user.email_verified
        let newPhoneVerified = user.phone_verified
        if(user.email !== email) {
            newEmailVerified = false
            newEmailToken = uuid.v4()
        }
        if(user.phone !== phone) {
            newPhoneVerified = false
            newPhoneToken = uuid.v4()
        }

        const updatedUser = await user.update({
            username: username? username : user.username,
            email: email? email : user.email,
            email_verified: newEmailVerified,
            email_verification_token: newEmailToken,
            phone: phone? phone : user.phone,
            phone_verified: newPhoneVerified,
            phone_verification_token: newPhoneToken
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
    findUserByEmailToken,
    updateUserById
}