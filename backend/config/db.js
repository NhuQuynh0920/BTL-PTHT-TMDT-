import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Wait 10s before failing
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`🚀 [Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ [Database Error] ${error.message}`);
        // Instead of exiting, let's wait and retry after 5 seconds
        console.log('🔄 Attempting to reconnect in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ [Database] Lost connection. Retrying...');
});

mongoose.connection.on('error', (err) => {
    console.error(`🔴 [Database Critical Error] ${err.message}`);
});

export default connectDB;
