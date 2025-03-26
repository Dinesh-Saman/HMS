const express = require('express');
const router = express.Router();
const { 
    addHomeInventoryItem, 
    getAllHomeInventoryItems, 
    getHomeInventoryItemById, 
    updateHomeInventoryItem, 
    deleteHomeInventoryItem,
    searchHomeInventoryItems
} = require('../controllers/HomeInventory');
const protect = require('../middlewares/member');

// Ensure all routes are protected and require authentication
router.route('/inventory')
    .post(addHomeInventoryItem)     // Add new home inventory item
    .get(getAllHomeInventoryItems); // Get all home inventory items

router.route('inventory/search')
    .get(searchHomeInventoryItems); // Search and filter home inventory items

router.route('/inventory/:id')
    .get(getHomeInventoryItemById)    // Get specific home inventory item
    .put(updateHomeInventoryItem)     // Update specific home inventory item
    .delete(deleteHomeInventoryItem); // Delete specific home inventory item

module.exports = router;