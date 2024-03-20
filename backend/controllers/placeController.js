const Place = require('../models/placeModel');

// Create a new place
const createPlaceFromGoogleApi = async (req, res) => {
    try {
        console.log(req.body);
        const displayName = req.body.displayName.text;
        const placeData = { ...req.body, displayName };
        const newPlace = await Place.create(placeData);
        res.status(201).json(newPlace);
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ error: 'Error creating place' });
    }
};

// Create multiple places
const createMultiplePlacesFromGoogleApi = async (req, res) => {
    try {
        const { places } = req.body;
        const createdPlaces = [];

        for (const placeData of places) {
            const displayName = placeData.displayName.text;
            const place = { ...placeData, displayName };
            const createdPlace = await Place.create(place);
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
        console.log(req.body);
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
            const createdPlace = await Place.create(placeData);
            createdPlaces.push(createdPlace);
        }

        res.json({ places: createdPlaces });
    } catch (error) {
        console.error('Error creating places:', error);
        res.status(500).json({ error: 'Error creating places' });
    }
};

  
// Update a place by its ID
const updatePlace = async (req, res) => {
    try {
        const displayName = req.body.displayName.text;
        const placeData = { ...req.body, displayName };
        
        const updatedPlace = await Place.findOneAndUpdate({ id: req.params.id }, placeData, { new: true });
        
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
  

module.exports = {
  createPlace,
  getPlace,
  updatePlace,
  deletePlace,
  getAllPlaces,
  createMultiplePlaces,
  createPlaceFromGoogleApi,
  createMultiplePlacesFromGoogleApi
};
