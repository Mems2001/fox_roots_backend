const models = require('../../models')
const uuid = require('uuid')
const mailer = require('../../utils/mailer')
const UsersServices = require('./users.services')
const crypto = require('crypto')
const { hashPassword } = require('../../utils/bcrypt')
const { compare } = require('bcrypt')

/**
 * Searchs for an usused and not expired token.
 * @param {uuid} user_id UUID like strig for the user id.
 * @param {integer} type The token type being: 0 -> password reset, 1 -> email verification, 2 -> phone verification 
 * @returns A unused and not expired token.
 */
async function findValidUserTokensByUserId(user_id, type) {
    const user_token = await models.UserTokens.findOne({
        where: {
            user_id,
            type,
            is_used: false
        }
    })

    if (user_token) {
        console.log('---> verifying token:', user_token, new Date(user_token.expires_at).getTime(), Date.now())
        console.log('---> verifying token:', new Date(user_token.expires_at).getTime(), Date.now())
        if (Date.now() < new Date(user_token.expires_at).getTime()) return user_token
    }

    return undefined
}

/**
 * Creates a userToken table and then use the mailer to send the toekn to the user.
 * @param {uuid} user_id The user id, a uuid string.
 * @param {integer} type The token type being one of the following: 0 -> password reset, 1 -> email verificcation, 2 -> phone verification
 */
async function sendEmailVerificationToken(user_id, type) {
    const transaction = await models.sequelize.transaction()
    let duration

    try {   
        const user = await UsersServices.findUserById(user_id)

        // Disables a previously valid token
        let user_token = await findValidUserTokensByUserId(user_id, type)
        if (user_token) {
                await user_token.update({
                    is_used: true
            }, {transaction})
        } else {
            console.log('---> user_token not found')
        }

        if (!user) return false

        const token = crypto.randomBytes(32).toString('hex')

        switch(type) {
            case 0:
                duration = new Date(Date.now() + 15*60*1000)
                break
            case 1:
                duration = new Date(Date.now() + 60*60*1000)
                break
            case 2: 
                duration = new Date(Date.now() + 60*60*1000)
                break
        }

        user_token = await models.UserTokens.create({
            id: uuid.v4(),
            user_id,
            hashed_token: hashPassword(token),
            type: type,
            expires_at: duration
        }, {transaction})

        mailer.sendEmail(user.email, token, user_id, 1)

        await transaction.commit()

        return true
    } catch (error) {
        await transaction.rollback()
        console.log({
            location: 'send email verification user tokens service', 
            message: error.message,
            error
        })
        throw error
    }
}

/**
 * The function returns true if it finds a valid token (if it does it also disables it), false otherwise.
 * @param {*} token The email verification token gotten as a route param.
 * @returns A boolean, true if it finds a valid token and false otherwise.
 */
async function verifyEmail(user_id, token, type) {
    const transaction = await models.sequelize.transaction()

    try {
        const user = await UsersServices.findUserById(user_id)
        const user_token = await findValidUserTokensByUserId(user_id, type)

        const email_verified = await compare(token, user_token.hashed_token)
        if (user_token && email_verified) {
            await user_token.update({
                is_used: true
            }, {transaction})
            await user.update({
                email_verified: true
            }, {transaction})

            await transaction.commit()

            return true
        }

        return false
    } catch (error) {
        await transaction.commit()
        console.error({
            location: 'verify email user token service',
            message: error.message,
            error
        })
    }
}

module.exports = {
    verifyEmail,
    sendEmailVerificationToken
}