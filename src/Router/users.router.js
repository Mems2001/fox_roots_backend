const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware');
const UsersControllers = require('../Controllers/users.controller')

const router = require('express').Router();

router.route('/me')
    .get(authenticateSessionMiddleware, UsersControllers.getMyUser)
    .patch(authenticateSessionMiddleware, UsersControllers.patchMyUser)

module.exports = router