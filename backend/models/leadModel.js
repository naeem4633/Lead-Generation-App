const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    issue: { type: String, required: false, default: 'Not Defined' },
    contactedViaEmail: { type: Boolean, default: false },
    contactedViaDm: { type: Boolean, default: false },
    contactedViaFb: { type: Boolean, default: false },
    responseReceived: { type: Boolean, default: false },
    responseVia: { type: String, default: 'N/A' },
    response: { type: String, default: 'N/A' }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;