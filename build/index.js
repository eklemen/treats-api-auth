'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _router = require('./services/router');

var _router2 = _interopRequireDefault(_router);

var _passport = require('./services/passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

_mongoose2.default.connect('mongodb://localhost/treats', function () {
    console.log('mongo connected, you good fam...');
});

app.use((0, _morgan2.default)('combined'));
app.use(_bodyParser2.default.json());
app.use(_passport2.default);
app.use('/v1', _router2.default);

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '127.0.0.1';

console.log('Listening on ', HOST, PORT);
app.listen(PORT, HOST);
//# sourceMappingURL=index.js.map