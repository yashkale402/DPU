import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

export const connectToDb = async () => {
    try {
        if (connection.isConnected) {
            console.log("Using existing connection");
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        console.log("Attempting to connect to MongoDB...");
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("New connection established successfully");
    } catch (error) {
        const err = error as Error & { name?: string };
        console.error("Error connecting to database:", error);

        if (error instanceof Error) {
            if (err.message.includes('MONGODB_URI')) {
                throw new Error("Database configuration missing. Please check environment variables.");
            }
            if (err.message.includes('authentication')) {
                throw new Error("Database authentication failed. Please check your credentials.");
            }
            if (err.message.includes('network')) {
                throw new Error("Network error connecting to database. Please check your connection.");
            }
            if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoServerSelectionError' || err.message?.includes('Could not connect')) {
                throw new Error(
                    "Cannot reach MongoDB. If using Atlas, add your current IP to the cluster's IP access list: https://www.mongodb.com/docs/atlas/security-whitelist/"
                );
            }
        }

        throw new Error("Error connecting to database");
    }
};
