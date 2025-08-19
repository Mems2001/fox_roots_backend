const ProfilesServices = require('../Services/profiles.services')
const UsersServices = require('../Services/users.services')

function getMyProfile (req, res) {
    const user_id = req.session.user.user_id

    ProfilesServices.findProfileByUserId(user_id)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'get my profile controller',
                message: err.message,
                err
            })
        })
}

function patchMyUser (req, res) {
    const user_id = req.session.user.user_id

    UsersServices.updateUserById(user_id, req.body)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                location: 'patch my user controller',
                message: err.message,
                err
            })
        })
}

module.exports = {
    getMyProfile,
    patchMyUser
}