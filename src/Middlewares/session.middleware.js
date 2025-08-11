const { verify } = require('jsonwebtoken')

function authenticateSessionMiddleware ( req , res , next ) {
    try {
        const access_token = req.cookies['access-token']
        
        console.log('---> auth middleware:', access_token)
        const data = verify(access_token, process.env.JWT_SECRET)
        console.log('---> auth middleware:', data)
        if (data) {
            req.session.user = data
            // req.session.role = data.role
            return next()
        } else {
            req.session.user = null
            res.status(401).json({
                location: 'Session middleware',
                message: 'Unauthorized'
            })
        }
    } catch (error) {
        req.session.user = null
        res.status(401).json({
            location: 'Session middleware',
            message: 'Unauthorized'
        })
    }
}

module.exports = {
    authenticateSessionMiddleware
}