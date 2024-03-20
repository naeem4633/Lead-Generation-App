const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    placeId: { type: mongoose.Schema.Types.String, ref: 'Place', required: true },
    issue: { type: String, required: true },
    contactedVia: { type: String, required: false },
    responseReceived: { type: Boolean, default: false },
    responseVia: { type: String, default: '' },
    response: { type: String, default: '' }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
