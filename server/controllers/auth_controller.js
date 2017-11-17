import User from '../models/user';
import config from '../config';
const jwt = require('jwt-simple');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret);
}

function signin(req, res, next) {
    const { user } = req;
    res.send({ token: tokenForUser(user), user_id: user.id });
}

function signup(req, res, next){
    const {
        body: {
            email,
            password
        }
    } = req;

    if(!email || !password) {
        return res.status(422)
            .json({error: 'You must provide email and password' });
    }

    // Check if user already exists, throw error if true
    User.findOne({ email }, (err, existingUser) => {
        if(err) return next(err);
        if(existingUser) {
            return res.status(422)
                .json({ error: 'This email is already in use.'});
        }
        const user = new User({ email, password });
        user.save( function(err) {
            if(err) return next(err);
            res.json({
                user_id: user._id,
                token: tokenForUser(user)
            });
        })
    })
}

function logout(req, res, next) {
    req.logout();
    res.json({
        status: 'logged out'
    });
}

function getUsers(req, res, next) {
    User.find({}, { password: 0 })
        .then( users => {
            return res.status(200).json({
                success: true,
                data: users
            })
        }).catch( err => {
            return res.status(500).json({
                message: err
            })
    })
}

const authController = {
    signup,
    signin,
    logout,
    getUsers
};

export default authController;
