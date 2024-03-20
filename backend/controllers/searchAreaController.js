const SearchArea = require("../models/searchAreaModel");

// Add a single search area
const addSearchArea = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.body;
        const searchArea = new SearchArea({ latitude, longitude, radius });
        await searchArea.save();
        res.status(201).json(searchArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add multiple search areas
const addMultipleSearchAreas = async (req, res) => {
    try {
        const searchAreas = req.body;
        const addedSearchAreas = await SearchArea.insertMany(searchAreas);
        res.status(201).json(addedSearchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a single search area from frontend
const addSearchAreaFromFrontend = async (req, res) => {
    try {
        const { marker, radius } = req.body;
        const { lat, lng } = marker;
        const searchArea = new SearchArea({ latitude: lat, longitude: lng, radius });
        await searchArea.save();
        res.status(201).json(searchArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add multiple search areas from frontend
const addMultipleSearchAreasFromFrontend = async (req, res) => {
    try {
        const searchAreas = req.body.map(area => ({
            latitude: area.marker.lat,
            longitude: area.marker.lng,
            radius: area.radius
        }));
        const addedSearchAreas = await SearchArea.insertMany(searchAreas);
        res.status(201).json(addedSearchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all search areas
const getAllSearchAreas = async (req, res) => {
    try {
        const searchAreas = await SearchArea.find();
        res.json(searchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a search area by its ID
const getSearchAreaById = async (req, res) => {
    try {
        const searchArea = await SearchArea.findById(req.params.id);
        if (!searchArea) {
            return res.status(404).json({ message: 'Search area not found' });
        }
        res.json(searchArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a search area
const updateSearchArea = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.body;
        const searchArea = await SearchArea.findById(req.params.id);
        if (!searchArea) {
            return res.status(404).json({ message: 'Search area not found' });
        }
        searchArea.latitude = latitude;
        searchArea.longitude = longitude;
        searchArea.radius = radius;
        await searchArea.save();
        res.json(searchArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a search area
const deleteSearchArea = async (req, res) => {
    try {
        const searchArea = await SearchArea.findById(req.params.id);
        if (!searchArea) {
            return res.status(404).json({ message: 'Search area not found' });
        }
        await searchArea.remove();
        res.json({ message: 'Search area deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addSearchArea,
    addMultipleSearchAreas,
    getAllSearchAreas,
    getSearchAreaById,
    updateSearchArea,
    deleteSearchArea,
    addSearchAreaFromFrontend,
    addMultipleSearchAreasFromFrontend,
};
