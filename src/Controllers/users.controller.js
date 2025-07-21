const UsersServices = require('../Services/users.services');

function getMyUser(req, res) {
    const user_id = req.session.user.user_id
    // const cookies = req.cookies
    console.log('---> user_id from users controllers', user_id)

    UsersServices.findUserById(user_id)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json({
                message: 'User not found'
            })
        })
        .catch(err => {
            res.status(400).json({
                location: 'Users controller',
                message: err.message,
                err
            })
        })
}

function patchMyUser(req, res) {
    const my_id = req.session.user.user_id
    console.log('---> updating user:', my_id)

    UsersServices.updateUserById(my_id, req.body)
        .then(data => {
            if (data) res.status(200).json(data)
            else res.status(404).json({
                message: 'User not found'
            })
        })
        .catch(err => {
            res.status(400).json({
                message: err.message,
                err
            })
        })
}

module.exports = {
    getMyUser,
    patchMyUser
}