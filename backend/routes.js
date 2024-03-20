const express = require('express');
const router = express.Router();
const fetchNearbyPlaces = require('./controllers/placesAPIController.js');
const { createPlace, getPlace, updatePlace, deletePlace, getAllPlaces, createMultiplePlaces, createPlaceFromGoogleApi, createMultiplePlacesFromGoogleApi} = require('./controllers/placeController.js');
const {addSearchArea, addMultipleSearchAreas, getAllSearchAreas, getSearchAreaById, updateSearchArea, deleteSearchArea, addSearchAreaFromFrontend, addMultipleSearchAreasFromFrontend} = require('./controllers/searchAreaController');
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
router.post('/place', createPlaceFromGoogleApi)
router.post('/places', createMultiplePlacesFromGoogleApi)
router.post('/placeNormal', createPlace)
router.post('/placesNormal', createMultiplePlaces)
router.get('/places/:id', getPlace)
router.get('/places', getAllPlaces)
router.delete('/places/:id', deletePlace)
router.put('/places/:id', updatePlace)

// Routes for search areas
router.post('/searchArea', addSearchAreaFromFrontend);
router.post('/searchAreas', addMultipleSearchAreasFromFrontend);
router.post('/searchAreaNormal', addSearchArea);
router.post('/searchAreasNormal', addMultipleSearchAreas);
router.get('/searchAreas', getAllSearchAreas);
router.get('/searchAreas/:id', getSearchAreaById);
router.put('/searchAreas/:id', updateSearchArea);
router.delete('/searchAreas/:id', deleteSearchArea);

// Routes for leads 
router.post('/lead', createLead);
router.post('/leads', createMultipleLeads);
router.get('/leads/:id', getLead);
router.get('/leads', getAllLeads);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);

module.exports = router;
