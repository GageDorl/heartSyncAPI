import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.URI;
if(!uri) {
    throw new Error("MongoDB URI is not defined in environment variables");
}

export async function connectDB() {
    try {
        await mongoose.connect(uri, {
            dbName: 'heartSyncAPI',
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}