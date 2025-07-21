const uuid = require('uuid');

const models = require('../../models')
const { sendEmail } = require('../../utils/mailer');
const UsersServices = require('./users.services');

async function sendEmailVerificationToken(id) {
    const user = await UsersServices.findUserById(id)

    if (!user) {
        return false
    }

    await sendEmail(user.email, user.email_verification_token).catch(err => console.error(err))

    return true
}

async function verifyEmail(token) {
    const user = await UsersServices.findUserByEmailToken(token)
    const transaction = await models.sequelize.transaction()
    
    if (!user) {
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
    sendEmailVerificationToken,
    verifyEmail
}