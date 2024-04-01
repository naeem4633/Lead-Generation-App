const SearchAreaResponseCount = require('../models/searchAreaResponseCount');

// Create a new searchAreaResponseCount
const createSearchAreaResponseCount = async (req, res) => {
    try {
        const searchAreaResponseCount = new SearchAreaResponseCount(req.body);
        const savedSearchAreaResponseCount = await searchAreaResponseCount.save();
        res.status(201).json(savedSearchAreaResponseCount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create multiple new searchAreaResponseCounts
const createMultipleSearchAreaResponseCounts = async (req, res) => {
    try {
        const searchAreaResponseCounts = req.body.map(data => new SearchAreaResponseCount(data));
        const savedSearchAreaResponseCounts = await SearchAreaResponseCount.insertMany(searchAreaResponseCounts);
        res.status(201).json(savedSearchAreaResponseCounts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all searchAreaResponseCounts
const getAllSearchAreaResponseCounts = async (req, res) => {
    try {
        const searchAreaResponseCounts = await SearchAreaResponseCount.find();
        res.json(searchAreaResponseCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a searchAreaResponseCount by ID
const getSearchAreaResponseCountById = async (req, res) => {
    const { id } = req.params;
    try {
        const searchAreaResponseCount = await SearchAreaResponseCount.findById(id);
        if (!searchAreaResponseCount) {
            return res.status(404).json({ message: 'SearchAreaResponseCount not found' });
        }
        res.json(searchAreaResponseCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a searchAreaResponseCount by ID
const updateSearchAreaResponseCountById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedSearchAreaResponseCount = await SearchAreaResponseCount.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedSearchAreaResponseCount) {
            return res.status(404).json({ message: 'SearchAreaResponseCount not found' });
        }
        res.json(updatedSearchAreaResponseCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a searchAreaResponseCount by ID
const deleteSearchAreaResponseCountById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSearchAreaResponseCount = await SearchAreaResponseCount.findByIdAndDelete(id);
        if (!deletedSearchAreaResponseCount) {
            return res.status(404).json({ message: 'SearchAreaResponseCount not found' });
        }
        res.json({ message: 'SearchAreaResponseCount deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all searchAreaResponseCounts
const deleteAllSearchAreaResponseCounts = async (req, res) => {
    try {
        await SearchAreaResponseCount.deleteMany();
        res.json({ message: 'All SearchAreaResponseCounts deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSearchAreaResponseCount,
    getAllSearchAreaResponseCounts,
    getSearchAreaResponseCountById,
    updateSearchAreaResponseCountById,
    deleteSearchAreaResponseCountById,
    deleteAllSearchAreaResponseCounts,
    createMultipleSearchAreaResponseCounts
};
