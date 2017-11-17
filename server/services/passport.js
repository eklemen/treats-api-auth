import passport from 'passport';
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
import User from '../models/user';
import config from '../config';

const localOptions = {
    usernameField: 'email'
};

const localStrategy = new LocalStrategy(localOptions, function(email, password, done) {
    // verify the username and password
    User.findOne({ email }, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);
        user.comparePassword(password, function(err, isMatch) {
            if(err) return done(err);
            if(!isMatch) return done(null, false);
            return done(null, user);
        })
    })
});

const jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
    console.log('payload received', payload);
    User.findById(payload.sub, (err, user) => {
        if(err) return done(err, false);
        if(user) {
            done(null, user);
        } else {
            done(null, false)
        }
    })
});

passport.use(jwtStrategy);
passport.use(localStrategy);
