const UsersServices = require('../Services/users.services');

function getMyUser(req, res) {
    const user_id = req.session.user.user_id
    console.log('---> user_id from users controllers')

    UsersServices.getUserById(user_id)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(400).json({
                location: 'Users controller',
                message: err.message,
                err
            })
        })
}

module.exports = {
    getMyUser
}