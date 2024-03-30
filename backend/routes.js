const express = require('express');
const router = express.Router();
const {fetchNearbyPlacesFromGoogle, getMultipleNearbyPlaces, getNearbyPlaces, getMultipleNearbyPlacesDefault } = require('./controllers/placesAPIController.js');
const { createPlace, getPlace, updatePlace, deletePlace, getAllPlaces, createMultiplePlaces, createPlaceFromGoogleApi, createMultiplePlacesFromGoogleApi, getPlacesByUserId} = require('./controllers/placeController.js');
const {addSearchArea, addMultipleSearchAreas, getAllSearchAreas, getSearchAreaById, updateSearchArea, deleteSearchArea, addSearchAreaFromFrontend, addMultipleSearchAreasFromFrontend, getLast50SearchAreas, getLast10SearchAreas, getLast100SearchAreas, deleteAllSearchAreas, getSearchAreasByUserId} = require('./controllers/searchAreaController');
const {createLead, createMultipleLeads, getLead, getAllLeads, updateLead, deleteLead, getLeadsByUserId} = require('./controllers/leadController');
const {getApiKey} = require('./controllers/apiKeyController');

router.post('/google-api', async (req, res) => {
  try {
    const { marker, radius } = req.body;
    const { lat, lng } = marker;
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API key not found. Please make sure to set the API_KEY environment variable.');
    }
    const placesData = await fetchNearbyPlacesFromGoogle(apiKey, lat, lng, radius);
    res.json(placesData);
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Error fetching nearby places' });
  }
});

// Define the route for fetching nearby places
router.post('/nearby-places', getNearbyPlaces);
router.post('/multiple-nearby-places-default', getMultipleNearbyPlacesDefault);
router.post('/multiple-nearby-places', getMultipleNearbyPlaces);

// Place routess
router.post('/place', createPlaceFromGoogleApi)
router.post('/places', createMultiplePlacesFromGoogleApi)
router.post('/placeNormal', createPlace)
router.post('/placesNormal', createMultiplePlaces)
router.get('/places/:id', getPlace)
router.get('/places', getAllPlaces)
router.delete('/places/:id', deletePlace)
router.put('/places/:id', updatePlace)
router.get('/places/by-user/:user_id', getPlacesByUserId)

// Routes for search areas
router.post('/searchArea', addSearchAreaFromFrontend);
router.post('/searchAreas', addMultipleSearchAreasFromFrontend);
router.post('/searchAreaNormal', addSearchArea);
router.post('/searchAreasNormal', addMultipleSearchAreas);
router.get('/searchAreas', getAllSearchAreas);
router.get('/last50SearchAreas', getLast50SearchAreas);
router.get('/last100SearchAreas', getLast100SearchAreas);
router.get('/last10SearchAreas', getLast10SearchAreas);
router.get('/searchAreas/:id', getSearchAreaById);
router.put('/searchAreas/:id', updateSearchArea);
router.delete('/searchAreas/:id', deleteSearchArea);
router.delete('/searchAreasDeleteAll/', deleteAllSearchAreas);
router.get('/searchAreas/by-user/:user_id', getSearchAreasByUserId);

// Routes for leads 
router.post('/lead', createLead);
router.post('/leads', createMultipleLeads);
router.get('/leads/:id', getLead);
router.get('/leads', getAllLeads);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);
router.get('/leads/by-user/:user_id', getLeadsByUserId);

router.get('/api-key', getApiKey);

module.exports = router;