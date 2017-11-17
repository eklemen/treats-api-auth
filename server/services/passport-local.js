// import passport from 'passport';
// const LocalStrategy = require('passport-local');
// import User from '../models/user';
//
// const localOptions = {
//     usernameField: 'email',
// };
//
// const localStrategy = new LocalStrategy(localOptions, (email, password, done) => {
//     // verify the username and password
//     User.findOne({ email }, (err, user) => {
//         console.log('email from other ', email);
//         console.log('pass from other ', password);
//         if(err) return done(err);
//         if(!user) return done(null, false);
//         user.comparePassword(password, (err, isMatch) => {
//             if(err) return done(err);
//             if(!isMatch) return done(null, false);
//             return done(null, user);
//         })
//     })
// });
//
// passport.use(localStrategy);
