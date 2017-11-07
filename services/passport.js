import passport from 'passport';
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
import User from '../models/user';
import config from '../config';

const localOptions = {
    usernameField: 'email',
};

const localStrategy = new LocalStrategy(localOptions, (email, password, done) => {
    // verify the username and password
    User.findOne({ email }, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);
        user.comparePassword(password, (err, isMatch) => {
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
    User.findById(payload.sub, (err, user) => {
        if(err) return done(err, false);
        if(user) {
            done(null, user);
        } else {
            done(null, false)
        }
    })
});

const passportService = passport.use(jwtStrategy);
export const localStrat = passport.use(localStrategy);

export default passportService;