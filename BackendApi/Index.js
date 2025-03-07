const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Configure session
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Connect to MongoDB using the new database name and collection
mongoose.connect('mongodb://localhost:27017/Login&Register', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB (Login&Register database)'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Specify the collection name as "users" to match your Mongo shell query
const User = mongoose.model('User', userSchema, 'users'); // Use "users" collection

// **Register Endpoint**
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    // Save the user to the database
    await newUser.save();
    console.log('User registered:', newUser);  // Log the user object to check if it saved successfully
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);  // Log the error
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});

// **Login Endpoint**
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Trim any unnecessary spaces from email
  const trimmedEmail = email.trim();

  // Find user by email (case-insensitive)
  const user = await User.findOne({ email: new RegExp('^' + trimmedEmail + '$', 'i') });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  // Create session
  req.session.userId = user._id;
  req.session.username = user.username;

  res.status(200).json({ message: 'Login successful' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
