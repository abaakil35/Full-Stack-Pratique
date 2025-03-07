const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb://127.0.0.1:27017"; // MongoDB connection string
const client = new MongoClient(uri);
const dbName = "Login&Register"; // Updated database name

let db; // Database reference

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName); // Set the database instance
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

// Initialize the database connection
connectToDatabase();

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Registration endpoint
app.post("/register", async (req, res) => {
  console.log("POST /register");

  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      username,
      password: hashedPassword,
    };

    // Insert user into the 'users' collection
    const result = await db.collection("users").insertOne(data);

    // Log the result
    console.log("User inserted:", result);

    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Error during registration" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  console.log("POST /login", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user in the 'users' collection
    const user = await db.collection("users").findOne({ email });

    console.log("User found:", user); // Add this line to check if the user exists

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
