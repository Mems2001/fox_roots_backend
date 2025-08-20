const uuid = require('uuid')
const models = require('../../models')
const { hashPassword } = require('../../utils/bcrypt')
const RolesServices = require('../Services/roles.services')
const CartsServices = require('../Services/carts.services')

/**
 * This function handles both regular user and anon user creation. Toggles between those function by receiving a role param. It also reasign carts from anons to users if needed.
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

    let profileData = {
        id: uuid.v4(),
        user_id: userData.id,
        username: userData.username
    }

    // console.log('user data: ', role_name, userData)
    const transaction = await models.sequelize.transaction()

    try {
        const newUser = await models.Users.create(userData, {transaction})
        const newProfile = await models.Profiles.create(profileData, {transaction})

        //Cart reassignation
        if (id) {
            const cart = await CartsServices.findCartByUserId(id)
            const anonCart = await CartsServices.findCartByUserId(id)
            if (!cart && anonCart) {
                await CartsServices.reassingCartByUserId(id, anonCart.id)
            }
        }

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

async function updateUserById(id, {username, email, phone, profile_image, address, lat, lng, residence_number, residence_description}) {
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

        const profile = await models.Profiles.findOne({
            where: {
                user_id: user.id
            }
        })

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
            username: username ?? user.username,
            email: email ?? user.email,
            email_verified: newEmailVerified,
            email_verification_token: newEmailToken,
            phone: phone ?? user.phone,
            phone_verified: newPhoneVerified,
            phone_verification_token: newPhoneToken
        }, {transaction})
        const updatedProfile = await profile.update({
            username: username ?? user.username,
            profile_image: profile_image ?? profile.profile_image,
            address: address ?? profile.address,
            lat: lat ?? profile.lat,
            lng: lng ?? profile.lng,
            residence_number: residence_number ?? profile.residence_number,
            residence_description: residence_description ?? profile.residence_description
        }, {transaction})

        await transaction.commit()
    
        return {
            User: updatedUser,
            id: updatedProfile.id,
            username: updatedProfile.username,
            profile_image: updatedProfile.profile_image,
            address: updatedProfile.address,
            lat: updatedProfile.lat,
            long: updatedProfile.long,
            residence_number: updatedProfile.residence_number,
            residence_description: updatedProfile.residence_description,
            created_at: updatedProfile.created_at,
            updated_at: updatedProfile.updated_at
        }
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