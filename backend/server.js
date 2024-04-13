const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB = require('./dbConnection');
const routes = require('./routes');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const corsOptions ={
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Use the routes
app.use('/api', routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// This route should serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});