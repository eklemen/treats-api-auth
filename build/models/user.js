'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
var Schema = _mongoose2.default.Schema;


var validateEmail = function validateEmail(email) {
    return (/\S+@\S+\.\S+/.test(email)
    );
};

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'Email is required',
        validate: [validateEmail, 'Please enter a valid email.']
    },
    password: { type: String },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (user.isNew || user.isModified('password')) {
        _bcryptNodejs2.default.genSalt(10, function (err, salt) {
            if (err) return next(err);
            _bcryptNodejs2.default.hash(user.password, salt, null, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    _bcryptNodejs2.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = _mongoose2.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map