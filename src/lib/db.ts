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
        const db = await mongoose.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;
        console.log("New connection established successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
        
        if (error instanceof Error) {
            if (error.message.includes('MONGODB_URI')) {
                throw new Error("Database configuration missing. Please check environment variables.");
            } else if (error.message.includes('authentication')) {
                throw new Error("Database authentication failed. Please check your credentials.");
            } else if (error.message.includes('network')) {
                throw new Error("Network error connecting to database. Please check your connection.");
            }
        }
        
        throw new Error("Error connecting to database");
    }
};
