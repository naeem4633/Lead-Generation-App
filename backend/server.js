const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./dbConnection');
const routes = require('./routes');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Middleware to inject API key into HTML file
app.use((req, res, next) => {
    // Read the HTML file
    fs.readFile(path.resolve(__dirname, '..', 'frontend', 'public', 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Replace placeholder with API key
        const htmlContent = data.replace('YOUR_API_KEY_PLACEHOLDER', process.env.API_KEY);

        // Set the modified HTML content to response locals
        res.locals.injectedHTML = htmlContent;
        next();
    });
});

// Serve static files of the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// Connect to MongoDB
connectDB();

// Use the routes
app.use('/api', routes);

// Serve the modified HTML content
app.get('/', (req, res) => {
    res.send(res.locals.injectedHTML);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});