const Place = require('../models/placeModel');

// Create a new place from Google API
const createPlaceFromGoogleApi = async (req, res) => {
  try {
      const { id, user_id } = req.body;
      
      // Check if a place with the same ID and user ID already exists
      const existingPlace = await Place.findOne({ id, user_id });
      if (existingPlace) {
          return res.status(400).json({ error: 'Place already exists' });
      }

      // Create a new place
      const newPlace = await Place.create(req.body);
      res.status(201).json(newPlace);
  } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({ error: 'Error creating place' });
  }
};

// Create multiple places from Google API
const createMultiplePlacesFromGoogleApi = async (req, res) => {
  try {
      const { places } = req.body;
      const createdPlaces = [];

      for (const placeData of places) {
          const { id, user_id } = placeData;
          
          // Check if a place with the same ID and user ID already exists
          const existingPlace = await Place.findOne({ id, user_id });
          if (existingPlace) {
              return res.status(400).json({ error: 'Place already exists' });
          }

          // Create a new place
          const createdPlace = await Place.create(placeData);
          createdPlaces.push(createdPlace);
      }

      res.json({ places: createdPlaces });
  } catch (error) {
      console.error('Error creating places:', error);
      res.status(500).json({ error: 'Error creating places' });
  }
};

// Create a new place
const createPlace = async (req, res) => {
  try {
      const { id, user_id } = req.body;
      
      // Check if a place with the same ID and user ID already exists
      const existingPlace = await Place.findOne({ id, user_id });
      if (existingPlace) {
          return res.status(400).json({ error: 'Place already exists' });
      }

      // Create a new place
      const newPlace = await Place.create(req.body);
      res.status(201).json(newPlace);
  } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({ error: 'Error creating place' });
  }
};

// Create multiple places
const createMultiplePlaces = async (req, res) => {
  try {
    const { places } = req.body;
    const createdPlaces = [];

    for (const placeData of places) {
      const { id, user_id } = placeData;

      try {
        // Check if a place with the same ID and user ID already exists
        const existingPlace = await Place.findOne({ id, user_id });
        if (existingPlace) {
          // Skip this place and continue to the next iteration
          console.log(`Place with ID ${id} already exists. Skipping.`);
          continue;
        }

        // Create a new place
        const createdPlace = await Place.create(placeData);
        createdPlaces.push(createdPlace);
      } catch (error) {
        // Log the error and continue to the next iteration
        console.error(`Error creating place with ID ${id}:`, error);
        continue;
      }
    }

    res.json({ places: createdPlaces });
  } catch (error) {
    console.error('Error creating places:', error);
    res.status(500).json({ error: 'Error creating places' });
  }
};

  // Delete a place by its ID
  const deletePlace = async (req, res) => {
    try {
      const deletedPlace = await Place.findOneAndDelete({ id: req.params.id });
      if (!deletedPlace) {
        return res.status(404).json({ error: 'Place not found' });
      }
      res.json(deletedPlace);
    } catch (error) {
      console.error('Error deleting place:', error);
      res.status(500).json({ error: 'Error deleting place' });
    }
  };  

  const deleteMultipleById = async (req, res) => {
    try {
        const { ids } = req.body;

        // Delete multiple objects based on the provided IDs
        const deletedObjects = await Promise.all(ids.map(async (id) => {
            const deletedObject = await Place.findOneAndDelete({ id });
            return deletedObject;
        }));

        // Check if any object was deleted
        if (deletedObjects.some(object => !object)) {
            return res.status(404).json({ error: 'Some objects not found' });
        }

        res.json(deletedObjects);
    } catch (error) {
        console.error('Error deleting objects:', error);
        res.status(500).json({ error: 'Error deleting objects' });
    }
};

    
  // Update a place by its ID
  const updatePlace = async (req, res) => {
    try {
        const { isLead } = req.body;
        
        const updatedPlace = await Place.findOneAndUpdate(
          { id: req.params.id }, { isLead }, { new: true }
        );
        
        if (!updatedPlace) {
            return res.status(404).json({ error: 'Place not found' });
        }
        
        res.json(updatedPlace);
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ error: 'Error updating place' });
    }
};
  
  // Get a place by its ID
  const getPlace = async (req, res) => {
    try {
      const place = await Place.findOne({ id: req.params.id });
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }
      res.json(place);
    } catch (error) {
      console.error('Error fetching place:', error);
      res.status(500).json({ error: 'Error fetching place' });
    }
  };
  
  // Get all places
  const getAllPlaces = async (req, res) => {
    try {
      const places = await Place.find();
      res.json(places);
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ error: 'Error fetching places' });
    }
  };
  
  //get all places of a specific user
  const getPlacesByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const places = await Place.find({ user_id });
        if (places.length === 0) {
            return res.status(404).json({ message: 'No places found for user' });
        }
        res.json(places);
    } catch (error) {
        console.error('Error fetching places by user ID:', error);
        res.status(500).json({ error: 'Error fetching places by user ID' });
    }
};


module.exports = {
  createPlace,
  getPlace,
  updatePlace,
  deletePlace,
  getAllPlaces,
  createMultiplePlaces,
  createPlaceFromGoogleApi,
  createMultiplePlacesFromGoogleApi,
  getPlacesByUserId,
  deleteMultipleById
};
