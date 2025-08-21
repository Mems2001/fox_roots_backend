const router = require('express').Router();

const { authenticateSessionMiddleware } = require('../Middlewares/session.middleware');
const AuthControllers = require('../Controllers/auth.controllers');

// Token verification
router.route('/verify-email/:token/:user_id')
    .get(AuthControllers.getVerifyEmail)

router.route('/password-reset/:token/:user_id')
    .get(AuthControllers.redirectToPasswordResetPage)
    .post(AuthControllers.postPasswordReset)

router.route('/verify-email')
    .post(authenticateSessionMiddleware, AuthControllers.sendEmailVerificationToken)

router.route('/password-reset')
    .post(authenticateSessionMiddleware, AuthControllers.sendPasswordResetToken)

// Common auth
router.route('/register')
    .post(AuthControllers.postUser)

router.route('/logout')
    .get(AuthControllers.logout)

router.route('/login')
    .post(AuthControllers.login)

router.route('/anon')
    .post(AuthControllers.postAnon)

router.route('/me')
    .delete(authenticateSessionMiddleware, AuthControllers.deleteMyUser)

router.route('/')
    .get(AuthControllers.authSession)

module.exports = router