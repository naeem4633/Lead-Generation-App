const axios = require('axios');

// Function to fetch nearby places
async function fetchNearbyPlaces(apiKey) {
  const requestData = {
    includedTypes: ["gym", "fitness_center"],
    excludedTypes: ["community_center", "university", "golf_course", "spa", "swimming_pool", "physiotherapist", "sports_complex", "sports_club"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { 
          latitude: 42.3501,
          longitude: -71.0712,  
        },
        radius: 1000,
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

module.exports = fetchNearbyPlaces;
