const router = require('express').Router();

const AuthControllers = require('../Controllers/auth.controllers')

router.route('/')
    .post(AuthControllers.postUser)

module.exports = router