const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // console.log("MONGO URI: ", process.env.MONGO_URI);
const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/impact_db', {
            maxPoolSize: 20,              // allow up to 20 simultaneous DB operations
            serverSelectionTimeoutMS: 5000, // fail fast if Atlas unreachable
            socketTimeoutMS: 30000,        // drop hanging queries after 30s
            heartbeatFrequencyMS: 10000,   // keep connections warm, no cold-start delay
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
