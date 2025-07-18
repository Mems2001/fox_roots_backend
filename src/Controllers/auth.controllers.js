const { comparePasswords } = require('../../utils/bcrypt');
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

module.exports = {
    postUser,
    login
}