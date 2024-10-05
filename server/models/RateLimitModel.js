import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema({
    atempts: {
        type: Number,
        required: true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
}, { timestamps: true });


const RateLimitModel = mongoose.model("rate", RateSchema);

export default RateLimitModel;