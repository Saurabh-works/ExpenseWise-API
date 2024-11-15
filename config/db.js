// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// const MONGO_URI = "mongodb+srv://Saurabh:Saurabh@2315@cluster0.srcrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const MONGO_URI = "mongodb+srv://Saurabh:Saurabh%402315@cluster0.srcrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const connectDB = async () => {
  try{
    const DB_OPTIONS={
      dbName: "expense",
    }
    await mongoose.connect(MONGO_URI, DB_OPTIONS);
    console.log('Connected Successfully..');
  } catch (error) {
       console.error('MongoDB connection failed:', error.message);
       process.exit(1);
  }
};

module.exports = connectDB;
 