const { verify } = require('jsonwebtoken');
const { comparePasswords } = require('../../utils/bcrypt');
const { generateJWT } = require('../../utils/generate-jwt');
const AuthServices = require('../Services/auth.services');
const UsersServices = require('../Services/users.services');
const RolesServices = require('../Services/roles.services');
const CartsServices = require('../Services/carts.services')

async function postUser (req, res) {
    const {username} = req.body

    let user

    user = await UsersServices.findUserByUsername(username)

    if (user) {
        return res.status(409).json({
            message: 'This user already exists'
        })
    }

    UsersServices.createUser(undefined, undefined, req.body)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(400).json({
                message: err.message,
                err
            })
        })
}

async function login (req, res) {
    const {withPhone, withEmail, email, phone, password} = req.body
    const cookie = req.cookies['access-token']

    try {
        let user
        //First we validate the login method.
        if (withEmail) {
            user = await UsersServices.findUserByEmail(email)
            if (!user) {
                return res.status(404).json({
                    message: 'User with this email was not found'
                })
            }
        }

        if (withPhone) {
            user = await UsersServices.findUserByPhone(phone)
            if (!user) {
                return res.status(404).json({
                    message: 'User with this phone was not found'
                })
            }
        }

        //Password validation
        const validatePassword = await comparePasswords(password, user.password)
        if (!validatePassword) {
            return res.status(400).json({
                message: 'Wrong password'
            })
        }

        //Cart reassignation
        if (cookie) {
            const anon_user = verify(cookie, process.env.JWT_SECRET)
            const cart = await CartsServices.findCartByUserId(user.id)
            const anonCart = await CartsServices.findCartByUserId(anon_user.user_id)
            if (!cart && anonCart) {
                await CartsServices.reassingCartByUserId(user.id, anonCart.id)
            }
        }

        //JWT generation
        const accesToken = await generateJWT(user.id , user.role_id, '1d');
        // const refreshToken = await generateJWT(user.id , user.role_id , '7 d');
        res.setCookie('access-token', accesToken)
        // res.cookie('refresh-token' , refreshToken)
        res.status(200).json({
            message: `User ${user.username} logged in`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something went wrong, talk to any administrator',
            error
        })
    }
}

function logout(req, res) {
    console.log('logging out')

    try {
        req.session.user = null
        res.delCookie('access-token')
        res.status(200).json({
            session_authenticated: false,
            message: "User logged out"
        })
    } catch (error) {
        console.error(error)
    }
}

async function authSession(req, res) {
    console.log('cookies for authentication:', req.cookies)
    const cookie = req.cookies['access-token']

    try {
        if (cookie) {
            const data = verify(cookie , process.env.JWT_SECRET)
            console.log(data);
            if (!data) {
                req.session.user = null
                res.status(401).json({
                    session_authenticated: false,
                    message: 'Session expired'
                })
            }

            const user = await UsersServices.findUserById(data.user_id)

            if (user) {
                req.session.user = data
                console.log(user.username, ' authenticated')
                const anonRole = await RolesServices.findRoleByName('ANON')
                if (user.role_id === anonRole.id) {
                    res.status(200).json({
                        session_authenticated: false,
                        message: "Anon User, session not authenticated",
                        user_id: user.id,
                    })
                } else {
                    res.status(200).json({
                        session_authenticated: true,
                        message: "Session authenticated",
                        user_id: user.id,
                    })
                }
            } else {
                req.session.user = null
                res.delCookie('access-token')
                res.status(404).json({
                    session_authenticated: false,
                    message: "User doesn't exist"
                })
            }
        } else {
            req.session.user = null
            res.delCookie('access-token')
            res.status(406).json({
                session_authenticated: false,
                message: 'Cookie not found'
            })
        }
    } catch (error) {
        console.error(error)
        req.session.user = null
        res.delCookie('access-token')
        res.status(400).json({
            session_authenticated: false,
            message: 'Error, not logged in',
            error
        })
    }
}

/**
 * Creates an anonymous user 
 */
async function postAnon(req, res) {
    const {id} = req.body

    UsersServices.createUser('ANON', id, {undefined, undefined, undefined, undefined})
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'postAnon, auth controller',
                message: err.message,
                err
            })
        })

    // const token = await generateJWT(id, '1d')

    // res.setCookie('access-token', token)
    // res.status(201).json({
    //     session_authenticated: false,
    //     message: 'Anon user created',
    //     user_id: id
    // })
}

function sendEmailVerificationToken (req, res) {
    const user_id = req.session.user.user_id
    console.log('---> Sending email verification token for user:', user_id)

    AuthServices.sendEmailVerificationToken(user_id)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(400).json(data)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({
                message: 'Error sending email verification token',
                err
            })
        })
}

function getVerifyEmail(req, res) {
    const token = req.params.token

    AuthServices.verifyEmail(token)
        .then(data => {
            if (data) {
                res.redirect('https://foxroots593.netlify.app/me')
                // res.status(200).json(data)
            }
            else {
                res.redirect('https://foxroots593.netlify.app/')
                // res.status(400).json(data)
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({
                location: 'auth controllers',
                message: err.message,
                err
            })
        })
}

function deleteMyUser (req, res) {
    const user_id = req.session.user.user_id
    console.log('---> Deleting user:', user_id)

    UsersServices.destroyUserById(user_id)
        .then(data => {
            if (data) {
                req.session.user = null
                res.delCookie('access-token')
                res.status(200).json(data)
            }
            else res.status(404).json(data)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({
                message: err.message, 
                err
            })
        })
}

module.exports = {
    login,
    logout,
    postUser,
    postAnon,
    authSession,
    deleteMyUser,
    getVerifyEmail,
    sendEmailVerificationToken
}