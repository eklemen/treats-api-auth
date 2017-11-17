'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.houseController = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var houseController = exports.houseController = {};

houseController.post = function (req, res) {
    var decoded = req.decoded;

    var house = new _models2.default.House();
    house.creator = decoded;
    house.votes.push({ vote: 1, creator: decoded });
    house.save().then(function (newHouse) {
        return res.status(200).json({
            success: true,
            data: newHouse
        });
    }).catch(function (err) {
        return res.status(500).json({
            message: err
        });
    });
};

houseController.getAll = function (req, res) {
    _models2.default.House.find({}).then(function (houses) {
        return res.status(200).json({
            success: true,
            data: houses
        });
    }).catch(function (err) {
        return res.status(500).json({
            message: err
        });
    });
};

houseController.getOne = function (req, res) {
    var id = req.params.id;

    _models2.default.House.findById(id).then(function (house) {
        if (house === null) {
            return res.status(404).json({
                success: false,
                error: 'Not Found: No house with id: \'' + id + '\''
            });
        }
        return res.status(200).json({
            success: true,
            data: house
        });
    }).catch(function (err) {
        return res.status(500).json({
            message: err
        });
    });
};

houseController.submitVote = function (req, res) {
    var id = req.params.id,
        body = req.body,
        decoded = req.decoded;

    _models2.default.House.findByIdAndUpdate({ _id: id }, { "$push": { votes: _extends({}, body, { creator: decoded }) } }, function (error, data) {
        if (error) {
            return res.status(500).json({
                success: false,
                error: error
            });
        }
        if (body.vote !== 1 || body.vote !== 1) {
            return res.status(422).json({
                success: false,
                error: 'Invalid Data: vote must be 1 or -1 only.'
            });
        }
        if (data === null) {
            return res.status(404).json({
                success: false,
                error: 'House with id: \'' + id + '\' not found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: data
        });
    });
};

exports.default = houseController;
//# sourceMappingURL=houseController.js.map