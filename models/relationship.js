import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
    user1: {
        type: String,
        ref: 'User',
        required: true
    },
    user2: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'pending'
    },
    anniversary: {
        type: Date,
    }
} , { timestamps: true });

const Relationship = mongoose.model('Relationship', relationshipSchema);

export default Relationship;