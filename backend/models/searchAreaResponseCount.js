const mongoose = require('mongoose');

const searchAreaResponseCountSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    included_types: { type: [String], default: [] },
    excluded_types: { type: [String], default: [] },
    response_count: { type: Number, default: 0},
    user_id: { type: String, default: '' }
});

const SearchAreaResponseCount = mongoose.model('SearchAreaResponseCount', searchAreaResponseCountSchema);

module.exports = SearchAreaResponseCount;
