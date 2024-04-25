const Lead = require('../models/leadModel');

// Create a lead
const createLead = async (req, res) => {
    try {
        // Check if lead with the same user ID and place ID already exists
        const existingLead = await Lead.findOne({
            user_id: req.body.user_id,
            place: req.body.place
        });

        if (existingLead) {
            // Lead already exists, return an error response
            return res.status(400).json({ error: 'Lead already exists' });
        }

        // Lead does not exist, create a new lead
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
        // Check if any of the leads already exist
        const existingLeads = await Lead.find({
            user_id: { $in: req.body.map(lead => lead.user_id) },
            place: { $in: req.body.map(lead => lead.place) }
        });

        // Filter out existing leads from the request body
        const newLeads = req.body.filter(lead => {
            return !existingLeads.some(existingLead =>
                existingLead.user_id === lead.user_id &&
                existingLead.place === lead.place
            );
        });

        // Insert the new leads
        const leads = await Lead.insertMany(newLeads);
        res.status(201).json(leads);
    } catch (error) {
        console.error('Error creating multiple leads:', error);
        res.status(500).json({ error: 'Error creating multiple leads' });
    }
};


const getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('place');
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
        const leads = await Lead.find().populate('place');
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

const getLeadsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const leads = await Lead.find({ user_id }).populate('place');
        if (leads.length === 0) {
            return res.status(404).json({ message: 'No leads found for user' });
        }
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads by user ID:', error);
        res.status(500).json({ error: 'Error fetching leads by user ID' });
    }
};

// Delete all leads
const deleteAllLeads = async (req, res) => {
    try {
        const deletedLeads = await Lead.deleteMany();
        res.json(deletedLeads);
    } catch (error) {
        console.error('Error deleting all leads:', error);
        res.status(500).json({ error: 'Error deleting all leads' });
    }
};

module.exports = {
    createLead,
    createMultipleLeads,
    getLead,
    getAllLeads,
    updateLead,
    deleteLead,
    getLeadsByUserId,
    deleteAllLeads,
};
