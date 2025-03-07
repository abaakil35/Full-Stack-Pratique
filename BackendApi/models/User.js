const mongoose = require('mongoose');

// Define the schema for User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Specify the collection name 'users' to match the collection in MongoDB shell
const User = mongoose.model('User', userSchema, 'users'); // Use 'users' collection

module.exports = User;
