const Lead = require('../models/leadModel');

// Create a lead
const createLead = async (req, res) => {
    try {
        console.log(req.body)
        const lead = await Lead.create(req.body);
        res.status(201).json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Error creating lead' });
    }
};

// Add multiple leads
const createMultipleLeads = async (req, res) => {
    try {
        const leads = await Lead.insertMany(req.body);
        res.status(201).json(leads);
    } catch (error) {
        console.error('Error creating multiple leads:', error);
        res.status(500).json({ error: 'Error creating multiple leads' });
    }
};

const getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('placeId');
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        res.json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ error: 'Error fetching lead' });
    }
};

// Get all leads
const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate('placeId');
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Error fetching leads' });
    }
};


// Update a lead by its ID
const updateLead = async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ error: 'Error updating lead' });
    }
};

// Delete a lead by its ID
const deleteLead = async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);
        if (!deletedLead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        res.json(deletedLead);
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ error: 'Error deleting lead' });
    }
};

module.exports = {
    createLead,
    createMultipleLeads,
    getLead,
    getAllLeads,
    updateLead,
    deleteLead,
};
