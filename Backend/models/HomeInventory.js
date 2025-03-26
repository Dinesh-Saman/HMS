const mongoose = require('mongoose');

const homeInventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true }, // Name of the item (e.g., Sofa, Microwave)
  category: { type: String, required: true }, // Category (e.g., Furniture, Electronics)
  
  quantity: { type: Number, required: true, default: 1 }, // Quantity of the item
  purchaseDate: { type: Date, required: false }, // Purchase date
  
  price: { type: Number, required: false }, // Price of the item
  brand: { type: String, required: false }, // Brand (optional)
  
  
  
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Needs Repair', 'Broken'], required: true, default: 'Good' }, // Condition status
  
  warrantyExpiration: { type: Date, required: false }, // Warranty expiration date (if applicable)
  
  lastUpdated: { type: Date, default: Date.now }, // Date when item details were last updated
  
  notes: { type: String, required: false }, // Additional notes or description
  
  addedBy: { type: String, required: true }, // Name or ID of the user who added the item
});

const HomeInventory = mongoose.model('HomeInventory', homeInventorySchema);
module.exports = HomeInventory;