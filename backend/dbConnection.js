const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    console.log('MongoDB connected');

    // Check if the TMUC database already exists
    const adminDB = mongoose.connection.db.admin();
    const databases = await adminDB.listDatabases();
    const existingDB = databases.databases.find(db => db.name === 'Nearby-Search-Database');

    // If TMUC database doesn't exist, create it
    if (!existingDB) {
      await mongoose.connection.db.createCollection('Nearby-Search-Database');
      console.log('Nearby-Search-Database created');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;