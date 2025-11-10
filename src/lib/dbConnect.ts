import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to Database!");
        return
    }
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) {
            console.error('MONGODB_URI is not set in the environment')
            throw new Error('Missing MONGODB_URI')
        }
        const db = await mongoose.connect(uri, {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected Successfully!");
    } catch (error) {
        console.log("Database connection Failed!!",error);
        process.exit(1)
    }
}

export default dbConnect