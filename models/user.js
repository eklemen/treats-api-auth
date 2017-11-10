// import { Schema } from 'mongoose';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt-nodejs'

const validateEmail = (email) => (
    (/\S+@\S+\.\S+/).test(email)
);

const userSchema = new Schema({
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

userSchema.pre('save', function(next) {
    const user = this;
    if(user.isNew || user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        });
    } else next();

});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) return cb(err);
        cb(null, isMatch);
    })
};

const User = mongoose.model('User', userSchema);
export default User;
