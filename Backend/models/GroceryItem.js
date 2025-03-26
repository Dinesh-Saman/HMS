const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'liters', 'pcs', 'pack'], required: true },
  purchased: { type: Boolean },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);
module.exports = GroceryItem;