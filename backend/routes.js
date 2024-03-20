const express = require('express');
const router = express.Router();
const fetchNearbyPlaces = require('./controllers/placesAPIController.js');
const { createPlace, getPlace, updatePlace, deletePlace, getAllPlaces, createMultiplePlaces} = require('./controllers/placeController.js');
const {addSearchArea, addMultipleSearchAreas, getAllSearchAreas, getSearchAreaById, updateSearchArea, deleteSearchArea} = require('./controllers/searchAreaController');
const {createLead, createMultipleLeads, getLead, getAllLeads, updateLead, deleteLead} = require('./controllers/leadController');

router.get('/google-api', async (req, res) => {
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

// Routes for search areas
router.post('/searchAreas', addSearchArea);
router.post('/searchAreas/multiple', addMultipleSearchAreas);
router.get('/searchAreas', getAllSearchAreas);
router.get('/searchAreas/:id', getSearchAreaById);
router.put('/searchAreas/:id', updateSearchArea);
router.delete('/searchAreas/:id', deleteSearchArea);

// Routes for leads 
router.post('/leads', createLead);
router.post('/leads/multiple', createMultipleLeads);
router.get('/leads/:id', getLead);
router.get('/leads', getAllLeads);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

module.exports = router;
