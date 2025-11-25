const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Skipping database connection for now.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // W projekcie demo wolę, żeby aplikacja jasno się wywaliła,
    // niż udawała, że jest ok.
    process.exit(1);
  }
};

module.exports = connectDB;
