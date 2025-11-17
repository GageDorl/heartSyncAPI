import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
    relationshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Relationship',
        required: true
    },
    senderId: {
        type: String,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: String,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Letter = mongoose.model('Letter', letterSchema);

export default Letter;