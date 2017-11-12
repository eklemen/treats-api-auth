const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const voteSchema = new Schema({
    vote: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    _creator: { type: Schema.ObjectId, ref: 'User' },
    _house: { type: Schema.ObjectId, ref: 'House' }
});

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;