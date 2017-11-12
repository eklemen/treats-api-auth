const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = new Schema({
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    // _creator: { type: Schema.ObjectId, ref: 'User' },
    votes: [{
        vote: { type: Number, default: 1, max: 1, min: -1 },
        // _creator: { type: Schema.ObjectId, ref: 'User' }
    }]
});

houseSchema.pre('save', function(next) {
    if(!this.votes.length) {
        this.votes.push({
            vote: { type: Number, default: 1 },
            // _creator: { type: Schema.ObjectId, ref: 'User' }
        });
    }
    next();
});

const House = mongoose.model('House', houseSchema);
export default House;