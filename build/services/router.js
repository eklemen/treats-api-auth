'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth_controller = require('../controllers/auth_controller');

var _auth_controller2 = _interopRequireDefault(_auth_controller);

var _houseController = require('../controllers/houseController');

var _houseController2 = _interopRequireDefault(_houseController);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var ExtractJwt = require('passport-jwt').ExtractJwt;


var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var requireLogin = _passport2.default.authenticate('local', { session: false });

function protectedRoute(req, res, next) {
    res.send('Heres the secret');
}
router.route('/protected').get(requireAuth, protectedRoute);
// ---------------------------------------------------------
// Auth Routes
router.route('/signup').post(_auth_controller2.default.signup);
router.route('/signin').post([requireLogin, _auth_controller2.default.signin]);
router.get('/logout', _auth_controller2.default.logout);

// ---------------------------------------------------------
// User routes
router.get('/users', _auth_controller2.default.getUsers);

// TODO: move this out _________________________________________
router.use(function (req, res, next) {
    var authToken = ExtractJwt.fromHeader('authorization')(req);
    var decoded = _jwtSimple2.default.decode(authToken, _config2.default.secret);
    if (decoded) {
        req.decoded = decoded.sub;
        next();
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
// __________________________________________________________

// ---------------------------------------------------------
// House routes
// router.post('/houses', houseController.post);
router.route('/houses').post(requireAuth, _houseController2.default.post);
router.get('/houses', _houseController2.default.getAll);
router.get('/houses/:id', _houseController2.default.getOne);

// ---------------------------------------------------------
// Vote routes
router.route('/houses/:id/vote').put(requireAuth, _houseController2.default.submitVote);

exports.default = router;
//# sourceMappingURL=router.js.map