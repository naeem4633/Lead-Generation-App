const mongoose = require('mongoose');

const searchAreaSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true }
});

const SearchArea = mongoose.model('SearchArea', searchAreaSchema);

module.exports = SearchArea;
