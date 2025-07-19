const { verify } = require('jsonwebtoken');
const { comparePasswords } = require('../../utils/bcrypt');
const { generateJWT } = require('../../utils/generate-jwt');
const AuthServices = require('../Services/users.services');
const UsersServices = require('../Services/users.services');

async function postUser (req, res) {
    const {username} = req.body

    let user

    user = await UsersServices.getUserByUsername(username)

    if (user) {
        return res.status(409).json({
            message: 'This user already exists'
        })
    }

    AuthServices.createUser(req.body)
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

    try {
        let user
        //First we validate the login method.
        if (withEmail) {
            user = await UsersServices.getUserByEmail(email)
            if (!user) {
                res.status(404).json({
                    message: 'User with this email was not found'
                })
            }
        }

        if (withPhone) {
            user = await UsersServices.getUserByPhone(phone)
            if (!user) {
                res.status(404).json({
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

        //JWT generation
        const accesToken = await generateJWT(user.id , '1d');
        // const refreshToken = await generateJWT(user.id , user.role_id , '7 d');
        res.setCookie('access-token', accesToken)
        // res.cookie('refresh-token' , refreshToken)
        res.status(200).json({
            message: `User ${user.username} logged in`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something went wrong, talk to any administrator'
        })
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

            const user = await UsersServices.getUserById(data.user_id)

            if (user) {
                req.session.user = user
                console.log(user.username, ' authenticated')
                res.status(200).json({
                    session_authenticated: true,
                    message: "Session authenticated",
                    user_id: user.id,
                })
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
            message: 'Error, not logged in'
        })
    }
}

module.exports = {
    postUser,
    login,
    authSession
}