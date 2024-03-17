const express = require('express');
const router = express.Router();
const fetchNearbyPlaces = require('./controllers/placesAPIController.js');
const { createPlace, getPlace, updatePlace, deletePlace, getAllPlaces, createMultiplePlaces} = require('./controllers/placeController.js');

router.get('/google-places', async (req, res) => {
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

// Place routess
router.post('/place', createPlace)
router.post('/places', createMultiplePlaces)
router.get('/place/:id', getPlace)
router.get('/places', getAllPlaces)
router.delete('/place/:id', deletePlace)
router.put('/place/:id', updatePlace)

module.exports = router;
