const models = require('../../models')
const uuid = require('uuid')
const mailer = require('../../utils/mailer')
const UsersServices = require('./users.services')
const crypto = require('crypto')
const { hashPassword } = require('../../utils/bcrypt')
const { compare } = require('bcrypt')
const { Op } = require('sequelize')

/**
 * Searchs for an usused and not expired token.
 * @param {uuid} user_id UUID like strig for the user id.
 * @param {integer} type The token type being: 0 -> password reset, 1 -> email verification, 2 -> phone verification.
 * @param {boolean} with_expiration A boolean, false if you don't want to filter by expiration date. True by default.
 * @returns A unused and not expired token.
 */
async function findValidUserTokensByUserId(user_id, type, with_expiration=false) {
    const user_token = await models.UserTokens.findOne({
        where: {
            user_id,
            type,
            is_used: false
        }
    })

    if (!user_token) return undefined

    console.log('---> verifying token:', user_token, new Date(user_token.expires_at).getTime(), Date.now())
    console.log('---> verifying token:', new Date(user_token.expires_at).getTime(), Date.now())
    if (with_expiration) {
        if (Date.now() < new Date(user_token.expires_at).getTime()) return user_token
    }

    return user_token
}

/**
 * Creates a userToken table and then use the mailer to send the toekn to the user.
 * @param {uuid} user_id The user id, a uuid string.
 * @param {integer} type The token type being one of the following: 0 -> password reset, 1 -> email verificcation, 2 -> phone verification.
 * @param {boolean} with_expiration A boolean. True by default it allows to search token with an expiration date filter.
 */
async function sendVerificationToken(user_id, type) {
    const transaction = await models.sequelize.transaction()
    let duration

    try {   
        const user = await UsersServices.findUserById(user_id)

        // Disables a previously valid token
        let user_token = await findValidUserTokensByUserId(user_id, type)
        if (user_token) {
                console.log('---> token found:', user_token)
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

        mailer.sendEmail(user.email, token, user_id, type)

        await transaction.commit()

        return true
    } catch (error) {
        await transaction.rollback()
        console.log({
            location: 'send verification user tokens service', 
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
async function verifyToken(user_id, token, type) {
    const transaction = await models.sequelize.transaction()

    try {
        const user = await UsersServices.findUserById(user_id)
        const user_token = await findValidUserTokensByUserId(user_id, type, true)

        let verified
        if (user_token) verified = await compare(token, user_token.hashed_token)
        else return false

        if (user_token && verified) {
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
            location: 'verify token user token service',
            message: error.message,
            error
        })
    }
}

/**
 * Verfifies the provided token first, if valid it tries to change the password and if successful returns true. Returns false either if the token is invalid or if it fails to change the password.
 * @param {uuid} user_id UUID like string for the user id.
 * @param {string} token The verification token.
 * @param {integer} type The token type being: 0 -> password reset (the only one it should receive).
 * @param {string} password The new password for user updating.
 * @returns True if both the token is valid and the password was changed, false otherwise.
 */
async function changePassword(user_id, token, type, password) {
    const transaction = await models.sequelize.transaction()

    try {
        const verified = await verifyToken(user_id, token, type)

        if (verified) {
            const user = await UsersServices.findUserById(user_id)
            await user.update({
                password: hashPassword(password)
            }, {transaction})

            await transaction.commit()

            return true
        }

        return false
    } catch (error) {
        await transaction.rollback()
        console.error({
            location: 'change password user tokens service',
            message: error.message,
            error
        })
        throw error
    }
}

module.exports = {
    verifyToken,
    sendVerificationToken,
    changePassword
}