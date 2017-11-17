'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jwt-simple');

function tokenForUser(user) {
    var timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, _config2.default.secret);
}

function signin(req, res, next) {
    var user = req.user;

    res.send({ token: tokenForUser(user), user_id: user.id });
}

function signup(req, res, next) {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;


    if (!email || !password) {
        return res.status(422).json({ error: 'You must provide email and password' });
    }

    // Check if user already exists, throw error if true
    _user2.default.findOne({ email: email }, function (err, existingUser) {
        if (err) return next(err);
        if (existingUser) {
            return res.status(422).json({ error: 'This email is already in use.' });
        }
        var user = new _user2.default({ email: email, password: password });
        user.save(function (err) {
            if (err) return next(err);
            res.json({
                user_id: user._id,
                token: tokenForUser(user)
            });
        });
    });
}

function logout(req, res, next) {
    req.logout();
    res.json({
        status: 'logged out'
    });
}

function getUsers(req, res, next) {
    _user2.default.find({}, { password: 0 }).then(function (users) {
        return res.status(200).json({
            success: true,
            data: users
        });
    }).catch(function (err) {
        return res.status(500).json({
            message: err
        });
    });
}

var authController = {
    signup: signup,
    signin: signin,
    logout: logout,
    getUsers: getUsers
};

exports.default = authController;
//# sourceMappingURL=auth_controller.js.map