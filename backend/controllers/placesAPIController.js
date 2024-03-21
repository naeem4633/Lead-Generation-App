const axios = require('axios');
const apiKey = process.env.API_KEY;

// Function to process an array of searchArea objects and fetch nearby places for each
async function getMultipleNearbyPlaces(req, res) {
  try {
    // Ensure searchAreas is defined and is an array
    const searchAreas = req.body;
    if (!searchAreas || !Array.isArray(searchAreas)) {
      return res.status(400).json({ error: 'Search areas array is missing or invalid' });
    }

    // Array to store results
    const nearbyPlaces = [];

    // Process each search area
    for (const area of searchAreas) {
      const { marker, radius } = area;
      const { lat, lng } = marker;

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please make sure to set the API_KEY environment variable.');
      }

      // Call getNearbyPlaces function for each search area
      const nearbyPlace = await fetchNearbyPlacesFromGoogle(apiKey, lat, lng, radius);
      nearbyPlaces.push(nearbyPlace);
    }

    // Send the array of nearby places as the response
    res.json(nearbyPlaces);
  } catch (error) {
    // Handle errors
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ error: 'Error fetching nearby places' });
  }
}


//function to process data and call fetchNearbyPlacesFromGoogle
async function getNearbyPlaces(req, res) {
  try {
      // Extract latitude, longitude, and radius from the request body
      const { marker, radius } = req.body;
      const { lat, lng } = marker;

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please make sure to set the API_KEY environment variable.');
      }

      // Call fetchNearbyPlacesFromGoogle with the extracted parameters
      const nearbyPlaces = await fetchNearbyPlacesFromGoogle(apiKey, lat, lng, radius);
      
      // Send the nearby places as the response
      res.json(nearbyPlaces);
  } catch (error) {
      // Handle errors
      console.error('Error fetching nearby places:', error);
      res.status(500).json({ error: 'Error fetching nearby places' });
  }
}


// Function to fetch nearby places
async function fetchNearbyPlacesFromGoogle(apiKey, latitude, longitude, radius) {
  const requestData = {
    includedTypes: ["gym", "fitness_center"],
    excludedTypes: ["community_center", "university", "golf_course", "spa", "swimming_pool", "physiotherapist", "sports_complex", "sports_club"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { 
          latitude: latitude,
          longitude: longitude,  
        },
        radius: radius,
      },
    }
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.businessStatus',
      'places.googleMapsUri',
      'places.internationalPhoneNumber',
      'places.rating',
      'places.userRatingCount',
      'places.websiteUri'
      ]
    }
  };

  try {
    const response = await axios.post('https://places.googleapis.com/v1/places:searchNearby', requestData, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
}

module.exports = {
  getNearbyPlaces,
  fetchNearbyPlacesFromGoogle,
  getMultipleNearbyPlaces,
};
