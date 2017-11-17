'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.localStrat = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;
var LocalStrategy = require('passport-local');


var localOptions = {
    usernameField: 'email'
};

var localStrategy = new LocalStrategy(localOptions, function (email, password, done) {
    // verify the username and password
    _user2.default.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false);
            return done(null, user);
        });
    });
});

var jwtOptions = {
    secretOrKey: _config2.default.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

var jwtStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
    _user2.default.findById(payload.sub, function (err, user) {
        if (err) return done(err, false);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

var passportService = _passport2.default.use(jwtStrategy);
var localStrat = exports.localStrat = _passport2.default.use(localStrategy);

exports.default = passportService;
//# sourceMappingURL=passport.js.map