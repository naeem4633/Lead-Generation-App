const express = require('express');
const router = express.Router();
const fetchNearbyPlaces = require('./fetchNearbyPlaces.js');

router.get('/places', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please make sure to set the API_KEY environment variable.');
    }
    const placesData = await fetchNearbyPlaces(apiKey);
    res.json(placesData);
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Error fetching nearby places' });
  }
});

module.exports = router;
