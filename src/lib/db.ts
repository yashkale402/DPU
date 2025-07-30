import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

export const connectToDb = async () => {
    try {
        if (connection.isConnected) {
            console.log("Using existing connection");
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        connection.isConnected = db.connections[0].readyState;
        console.log("New connection established");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw new Error("Error connecting to database");
    }
};
