import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    relationshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Relationship',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    }, 
    duration: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['idea', 'planned', 'completed', 'canceled'],
        default: 'planned'
    }
} , { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;