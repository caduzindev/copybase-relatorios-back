import mongoose from "mongoose";

export async function databaseMongoInit() {
    await mongoose.connect(process.env.MONGO_URL as string, {
        authSource: 'admin',
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS, 
    })
}