const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id: { type: String, required: true, primaryKey: true },
    displayName: { type: String, required:true },
    internationalPhoneNumber: { type: String, default: '' },
    formattedAddress: { type: String, required: true },
    websiteUri: { type: String, default: '' },
    googleMapsUri: { type: String, default: '' },
    businessStatus: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    userRatingCount: { type: Number, default: 0 },
    user_id: { type: String, default: '', required: true }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;