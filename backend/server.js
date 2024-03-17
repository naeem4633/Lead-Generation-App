const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./dbConnection');
const routes = require('./routes'); 
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Use the routes
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
