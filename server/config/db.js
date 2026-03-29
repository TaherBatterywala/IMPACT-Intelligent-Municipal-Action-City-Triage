const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // console.log("MONGO URI: ", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/impact_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
