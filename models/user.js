import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    _id: {
        type: String,
        required: true,
    },
    authProviderId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    timezone: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;