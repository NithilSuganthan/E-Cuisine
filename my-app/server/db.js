const mongoose = require('mongoose');
const debug = require('debug')('server:db');

async function connect(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not provided');
  }

  mongoose.set('strictQuery', false);

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to MongoDB');
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connect, mongoose };