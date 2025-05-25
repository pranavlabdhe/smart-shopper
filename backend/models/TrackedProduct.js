// models/TrackedProduct.js
const mongoose = require('mongoose');

const trackedProductSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  productName: { type: String, required: true },
  platform: { type: String, required: true },
  desiredPrice: { type: Number, required: true },
  lastNotified: { type: Date }, // to avoid spamming
  site: { type: String }, // Amazon / Flipkart
});

module.exports = mongoose.model('TrackedProduct', trackedProductSchema);
