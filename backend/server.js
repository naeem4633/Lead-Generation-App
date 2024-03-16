const express = require('express');
const dotenv = require('dotenv');
const fetchNearbyPlaces = require('./fetchNearbyPlaces.js');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const apiKey = ""; // Get API key from environment variables

if (!apiKey) {
  console.error('API key not found. Please make sure to set the API_KEY environment variable.');
  process.exit(1); // Exit process if API key is not provided
}

app.get('/places', async (req, res) => {
  try {
    const placesData = await fetchNearbyPlaces(apiKey);
    res.json(placesData);
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Error fetching nearby places' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
