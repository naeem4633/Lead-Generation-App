const SearchArea = require("../models/searchAreaModel");

// Add a single search area
const addSearchArea = async (req, res) => {
    try {
        const { user_id, latitude, longitude, radius } = req.body;
        const searchArea = new SearchArea({ user_id, latitude, longitude, radius });
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
        const addedSearchAreas = [];

        for (const area of searchAreas) {
            // Check if the search area already exists
            const existingArea = await SearchArea.findOne(area);
            if (!existingArea) {
                // If it doesn't exist, add it
                const newArea = await SearchArea.create(area);
                addedSearchAreas.push(newArea);
            }
            // If it exists, simply skip it
        }

        res.status(201).json(addedSearchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a single search area from frontend
const addSearchAreaFromFrontend = async (req, res) => {
    try {
        const { marker, radius, user_id } = req.body;
        const { lat, lng } = marker;
        const searchArea = new SearchArea({ user_id, latitude: lat, longitude: lng, radius });
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
            user_id: area.user_id,
            latitude: area.marker.lat,
            longitude: area.marker.lng,
            radius: area.radius
        }));
        
        // Array to store unique search areas
        const uniqueSearchAreas = [];

        // Iterate over each search area received from the frontend
        for (const area of searchAreas) {
            // Check if a search area with the same latitude, longitude, and radius already exists
            const existingSearchArea = await SearchArea.findOne({
                user_id: area.user_id,
                latitude: area.latitude,
                longitude: area.longitude,
                radius: area.radius
            });

            // If the search area doesn't exist, add it to the uniqueSearchAreas array
            if (!existingSearchArea) {
                uniqueSearchAreas.push(area);
            }
        }

        // Insert the unique search areas into the database
        const addedSearchAreas = await SearchArea.insertMany(uniqueSearchAreas);
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

// Delete all search areas
const deleteAllSearchAreas = async (req, res) => {
    try {
        // Delete all search areas from the database
        await SearchArea.deleteMany({});
        res.json({ message: 'All search areas deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the last 50 search areas
const getLast50SearchAreas = async (req, res) => {
    try {
        const searchAreas = await SearchArea.find().sort({ _id: -1 }).limit(50);
        res.json(searchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the last 10 search areas
const getLast10SearchAreas = async (req, res) => {
    try {
        const searchAreas = await SearchArea.find().sort({ _id: -1 }).limit(10);
        res.json(searchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the last 100 search areas
const getLast100SearchAreas = async (req, res) => {
    try {
        const searchAreas = await SearchArea.find().sort({ _id: -1 }).limit(100);
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
        const { user_id, latitude, longitude, radius } = req.body;
        const searchArea = await SearchArea.findById(req.params.id);
        if (!searchArea) {
            return res.status(404).json({ message: 'Search area not found' });
        }
        searchArea.user_id = user_id;
        searchArea.latitude = latitude;
        searchArea.longitude = longitude;
        searchArea.radius = radius;
        await searchArea.save();
        res.json(searchArea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete search area
const deleteSearchArea = async (req, res) => {
    try {
        const searchArea = await SearchArea.findById(req.params.id);
        if (!searchArea) {
            return res.status(404).json({ message: 'Search area not found' });
        }
        await SearchArea.deleteOne({ _id: req.params.id });
        res.json({ message: 'Search area deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSearchAreasByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const searchAreas = await SearchArea.find({ user_id });
        if (searchAreas.length === 0) {
            return res.status(404).json({ message: 'No search areas found for user' });
        }
        res.json(searchAreas);
    } catch (error) {
        console.error('Error fetching search areas by user ID:', error);
        res.status(500).json({ error: 'Error fetching search areas by user ID' });
    }
};

// Get the last 50 search areas by user id
const getLast50SearchAreasByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const searchAreas = await SearchArea.find({ user_id }).sort({ _id: -1 }).limit(50);
        if (searchAreas.length === 0) {
            return res.status(404).json({ message: 'No search areas found for user' });
        }
        res.json(searchAreas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the last 100 search areas by user id
const getLast100SearchAreasByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const searchAreas = await SearchArea.find({ user_id }).sort({ _id: -1 }).limit(100);
        if (searchAreas.length === 0) {
            return res.status(404).json({ message: 'No search areas found for user' });
        }
        res.json(searchAreas);
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
    getLast50SearchAreas,
    getLast10SearchAreas,
    getLast100SearchAreas,
    deleteAllSearchAreas,
    getSearchAreasByUserId,
    getLast50SearchAreasByUserId,
    getLast100SearchAreasByUserId
};
