const uuid = require('uuid');
const models = require('../../models');
const { hashPassword } = require('../../utils/bcrypt');
const RolesServices = require('../Services/roles.services');

/**
 * This function handles both regular user and anon user creation. Toggles between those function by receiving a role param.
 * @param {string} role A string that specifies the type of user requested. If undefined, it will be regular user.
 * @param {string} id UUID like string that is provided only for ANON user requests.
 * @param {string} username
 * @param {string} email
 * @param {string} phone
 * @param {string} password
 * @returns 
 */
async function createUser(role_name, id, {username, email, phone, password}) {
    console.log('creating: ', role_name, id)
    let role
    if (role_name) {
        role = await RolesServices.findRoleByName(role_name)
    } else {
        role = await RolesServices.findRoleByName('CLIENT')
    }

    //This data will change if the requested user is ANON
    let userData

    if (role_name) {
        userData = {
            id,
            role_id: role.id,
            username: 'anon-' + id,
            email: id + '@anon.com',
            email_verification_token: uuid.v4(),
            phone_verification_token: uuid.v4(),
            password: hashPassword(id)
        }
    } else {
        userData = {
            id: uuid.v4(),
            role_id: role.id,
            username,
            email,
            email_verification_token: uuid.v4(),
            phone: phone? phone : undefined,
            phone_verification_token: uuid.v4(),
            password: hashPassword(password)
        }
    }

    // console.log('user data: ', role_name, userData)
    const transaction = await models.sequelize.transaction()

    try {
        const newUser = await models.Users.create(userData, {transaction})
        await transaction.commit()
        return newUser
    } catch (error) {
        await transaction.rollback()
        console.log('users services:', error)
        throw error
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
    return await models.Users.scope('withSensitiveData').findOne({
        where: {
            email
        }
    })
}

async function findUserByPhone (phone) {
    return await models.Users.scope('withSensitiveData').findOne({
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

async function destroyUserById(id) {
    const transaction = await models.sequelize.transaction()

    try {
        const user = await findUserById(id)

        if (!user) {
            return null
        }

        await user.destroy({transaction})

        await transaction.commit()

        return true
    } catch(error) {
        console.error(error)
        await transaction.rollback()
        throw error
    }
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserByEmail,
    findUserByPhone,
    findUserById,
    findUserByEmailToken,
    updateUserById,
    destroyUserById
}