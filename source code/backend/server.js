const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

//Importing user routes
const userRoutes = require('./routes/userRoute');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Establish MongoDB connection
const dbURL = process.env.DB_URL;
mongoose
    .connect(dbURL)
    .then(() => console.log('DB Connected Successfully'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Use the user routes
app.use('/api/user', userRoutes);

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Internship Management Portal!');
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});