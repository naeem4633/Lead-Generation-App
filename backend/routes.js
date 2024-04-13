const express = require('express');
const router = express.Router();
const {fetchNearbyPlacesFromGoogle, getMultipleNearbyPlaces, getNearbyPlaces } = require('./controllers/placesAPIController.js');
const { createPlace, getPlace, updatePlace, deletePlace, getAllPlaces, createMultiplePlaces, createPlaceFromGoogleApi, createMultiplePlacesFromGoogleApi, getPlacesByUserId, deleteMultipleById} = require('./controllers/placeController.js');
const {addSearchArea, addMultipleSearchAreas, getAllSearchAreas, getSearchAreaById, updateSearchArea, deleteSearchArea, addSearchAreaFromFrontend, addMultipleSearchAreasFromFrontend, getLast50SearchAreas, getLast10SearchAreas, getLast100SearchAreas, deleteAllSearchAreas, getSearchAreasByUserId, getLast50SearchAreasByUserId, getLast100SearchAreasByUserId} = require('./controllers/searchAreaController');
const {createLead, createMultipleLeads, getLead, getAllLeads, updateLead, deleteLead, getLeadsByUserId, deleteAllLeads} = require('./controllers/leadController');
const {createSearchAreaResponseCount, getAllSearchAreaResponseCounts, getSearchAreaResponseCountById, updateSearchAreaResponseCountById, deleteSearchAreaResponseCountById, deleteAllSearchAreaResponseCounts, createMultipleSearchAreaResponseCounts} = require('./controllers/searchAreaResponseCountController');
const {getApiKey} = require('./controllers/apiKeyController');
const { validateFirebaseToken } = require('./middleware/firebaseAuthMiddleware.js');

// Define the route for fetching nearby places
router.post('/nearby-places', getNearbyPlaces);
router.post('/multiple-nearby-places', getMultipleNearbyPlaces);

// Place routess
router.post('/place', createPlaceFromGoogleApi)
router.post('/places', createMultiplePlacesFromGoogleApi)
router.post('/placeNormal', createPlace)
router.post('/placesNormal', createMultiplePlaces)
router.get('/places/:id', getPlace)
router.get('/places', validateFirebaseToken, getAllPlaces)
router.delete('/places/:id', deletePlace)
router.delete('/places', deleteMultipleById)
router.put('/places/:id', updatePlace)
router.get('/places/by-user/:user_id', validateFirebaseToken, getPlacesByUserId)

// Routes for search areas
router.post('/searchArea', addSearchAreaFromFrontend);
router.post('/searchAreas', addMultipleSearchAreasFromFrontend);
router.post('/searchAreaNormal', addSearchArea);
router.post('/searchAreasNormal', addMultipleSearchAreas);
router.get('/searchAreas', validateFirebaseToken, getAllSearchAreas);
router.get('/last50SearchAreas', validateFirebaseToken, getLast50SearchAreas);
router.get('/last100SearchAreas', validateFirebaseToken, getLast100SearchAreas);
router.get('/searchAreas/:id', getSearchAreaById);
router.put('/searchAreas/:id', updateSearchArea);
router.delete('/searchAreas/:id', deleteSearchArea);
router.delete('/searchAreasDeleteAll/', deleteAllSearchAreas);
router.get('/searchAreas/by-user/:user_id', validateFirebaseToken, getSearchAreasByUserId);
router.get('/last50SearchAreas/by-user/:user_id', validateFirebaseToken, getSearchAreasByUserId);
router.get('/last100SearchAreas/by-user/:user_id', validateFirebaseToken, getSearchAreasByUserId);

// Routes for leads 
router.post('/lead', createLead);
router.post('/leads', createMultipleLeads);
router.get('/leads/:id', getLead);
router.get('/leads', validateFirebaseToken, getAllLeads);
router.put('/leads/:id', updateLead);
router.delete('/leads/:id', deleteLead);
router.delete('/leadsDeleteAll', deleteAllLeads);
router.get('/leads/by-user/:user_id', validateFirebaseToken, getLeadsByUserId);

//Routes for API controller
router.get('/api-key', getApiKey);

//Routes for Search Area Response Count
router.post("/searchAreaResponseCount", createSearchAreaResponseCount);
router.post("/searchAreaResponseCounts", createMultipleSearchAreaResponseCounts);
router.get("/searchAreaResponseCounts", validateFirebaseToken, getAllSearchAreaResponseCounts);
router.get("/searchAreaResponseCounts/:id", getSearchAreaResponseCountById);
router.put("/searchAreaResponseCounts/:id", updateSearchAreaResponseCountById);
router.delete("/searchAreaResponseCounts/:id", deleteSearchAreaResponseCountById);
router.delete("/searchAreaResponseCountsDeleteAll", deleteAllSearchAreaResponseCounts);

module.exports = router;