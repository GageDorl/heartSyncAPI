import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    relationshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Relationship',
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    closenessLevel: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const Checkin = mongoose.model('Checkin', checkinSchema);

export default Checkin;