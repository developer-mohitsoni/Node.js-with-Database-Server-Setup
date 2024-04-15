const mongoose = require("mongoose");
require("dotenv").config();

// Define the MongoDB connection URL

const mongoURL =
  process.env.MONGODB_URL; // Replace 'myDatabase' with your database name

// Setup MongoDB Connection

mongoose.connect(mongoURL, {
  useNewUrlParser: true, // New URL parser
  useUnifiedTopology: true, // New Server Discover and Monitoring engine
});

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// define event listeners for the MongoDB connection

db.on("connected", () => {
  console.log("Connected to MongoDB Server");
});

db.on("error", (err) => {
  console.log("MongoDB Connection Error: ", err);
});

db.on("Disconnected", () => {
  console.log("MongoDB Disconnected");
});

// Export the database connection
module.exports = db;
