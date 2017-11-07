import passport from 'passport';
import express from 'express';
const router = express.Router();
import authController from '../controllers/auth_controller';
import houseController from '../controllers/houseController';
import passportService from './passport';
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

function protectedRoute(req, res, next) {
    res.send('Heres the secret');
}
router.route('/protected')
    .get(requireAuth, protectedRoute);

// ---------------------------------------------------------
// Auth Routes
router.route('/signup')
    .post(authController.signup);
router.route('/signin')
    .post([requireLogin, authController.signin]);

// ---------------------------------------------------------
// House routes
router.post('/houses', houseController.post);
router.route('/houses')
    .get(requireAuth, houseController.post);
router.get('/houses', houseController.getAll);

export default router;
