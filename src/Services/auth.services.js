const uuid = require('uuid');

const models = require('../../models')
const UsersServices = require('./users.services');

/**
 * This function verifies the email by first checking the token authenticity, and then simply updates the email_verify field in the user table and creates a new token in case of new email verifycation needed.
 * @param {uuid} token A uuid like string
 * @returns 
 */
async function verifyEmail(token) {
    //To verify token's authenticity we simply search for a user which email_token field matches with the provided param.
    const user = await UsersServices.findUserByEmailToken(token)
    const transaction = await models.sequelize.transaction()
    console.log('---> Verifying email for:', user.email, 'with token:', token)
    
    if (!user) {
        console.error('User nor found for token:', token)
        return false
    }

    try {
        await user.update({
            email_verified: true,
            email_verification_token: uuid.v4()
        }, {transaction})

        await transaction.commit()

        return true
    } catch(error) {
        console.error(error)
        await transaction.rollback()
        return false
    }
}

module.exports = {
    verifyEmail
}