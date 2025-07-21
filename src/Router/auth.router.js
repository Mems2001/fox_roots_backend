const router = require('express').Router();

const AuthControllers = require('../Controllers/auth.controllers')

router.route('/register')
    .post(AuthControllers.postUser)

router.route('/login')
    .post(AuthControllers.login)

router.route('/logout')
    .get(AuthControllers.logout)

router.route('/')
    .get(AuthControllers.authSession)

module.exports = router