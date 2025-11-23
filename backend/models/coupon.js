const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },         // Number hi better hai!
  discount: { type: Number, required: true },      // Number hi safest for calculation
  expiry: { type: String, required: true },        // ISO date string best, abhi string rakh sakte ho
  code: { type: String, required: true, unique: true },
  images: [String],      // multiple images URLs
  thumbnail: String,     // for main image (optional if used)
  description: String,
  addedBy: String        // User's name, ID, or email (future: ObjectId ref if needed)
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
