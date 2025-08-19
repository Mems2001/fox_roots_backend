const router = require('express').Router()

const ProfilesControllers = require('../Controllers/profiles.controllers')
const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware')

router.route('/me')
    .get(authenticateSessionMiddleware, ProfilesControllers.getMyProfile)
    .patch(authenticateSessionMiddleware, ProfilesControllers.patchMyUser)

module.exports = router