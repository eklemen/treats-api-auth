const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import Vote from './vote';

const houseSchema = new Schema({
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    _creator: { type: Schema.ObjectId, ref: 'User' },
    _votes: [{ type: Schema.ObjectId, ref: 'Vote' }]
});

houseSchema.pre('save', function(next) {
    if(!this._votes.length) {
        const initVote = new Vote();
        this._votes.push(initVote);
    }
    next();
});

const House = mongoose.model('House', houseSchema);
export default House;