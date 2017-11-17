'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;


var voteSchema = new Schema({
    vote: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    _creator: { type: Schema.ObjectId, ref: 'User' },
    _house: { type: Schema.ObjectId, ref: 'House' }
});

var Vote = mongoose.model('Vote', voteSchema);
exports.default = Vote;
//# sourceMappingURL=vote.js.map