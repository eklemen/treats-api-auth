import passport from 'passport';
import express from 'express';
const router = express.Router();
import authController from '../controllers/auth_controller';
import houseController from '../controllers/houseController';
import passportService from './passport';
const ExtractJwt = require('passport-jwt').ExtractJwt;
import jwt from 'jwt-simple';
import config from '../config';

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

function protectedRoute(req, res, next) {
    res.send('Heres the secret');
}
router.route('/protected')
    .get(requireAuth, protectedRoute);

// TODO: move this out _________________________________________
router.use(function(req, res, next) {
    const authToken = ExtractJwt.fromHeader('authorization')(req);
    const decoded = jwt.decode(authToken, config.secret);
    if(decoded) {
        req.decoded = decoded.sub;
        next()
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
// __________________________________________________________



// ---------------------------------------------------------
// Auth Routes
router.route('/signup')
    .post(authController.signup);
router.route('/signin')
    .post([requireLogin, authController.signin]);

// ---------------------------------------------------------
// User routes
router.get('/users', authController.getUsers);


// ---------------------------------------------------------
// House routes
// router.post('/houses', houseController.post);
router.route('/houses')
    .post(requireAuth, houseController.post);
router.get('/houses', houseController.getAll);

// ---------------------------------------------------------
// Vote routes
router.route('/houses/:id/vote')
    .put(requireAuth, houseController.submitVote);




export default router;
