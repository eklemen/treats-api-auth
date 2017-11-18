const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const houseSchema = new Schema({
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    creator: String,
    position: {
        lat: Number,
        long: Number
    },
    votes: [{
        vote: { type: Number, default: 1, max: 1, min: -1 },
        creator: String,
        created_at: { type: Date, default: Date.now }
    }]
}, { timestamps: { createdAt: 'created_at' } });

houseSchema.pre('save', function(next) {
    if(!this.votes.length) {
        this.votes.push({
            vote: { type: Number, default: 1 },
            creator: String
        });
    }
    next();
});

const House = mongoose.model('House', houseSchema);
export default House;