const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
    placeId: { type: mongoose.Schema.Types.String, required: true },
    issue: { type: String, required: false, default: 'Not Defined' },
    contactedVia: { type: String, required: false, default: 'N/A' },
    responseReceived: { type: Boolean, default: false, default: false },
    responseVia: { type: String, default: 'N/A' },
    response: { type: String, default: 'N/A' }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
