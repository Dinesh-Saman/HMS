const express = require('express');
const router = express.Router();
const groceryItems = require('../controllers/GroceryItem');
const protect = require('../middlewares/member');  // Assume you have an authentication middleware

// Ensure all routes are protected and require authentication
router.route('/api')
    .post(groceryItems.addGroceryItem)     // Add new grocery item
    .get(groceryItems.getAllGroceryItems); // Get all grocery items

router.route('/api/:id')
    .get(groceryItems.getGroceryItemById)    // Get specific grocery item
    .put(groceryItems.updateGroceryItem)     // Update specific grocery item
    .delete(groceryItems.deleteGroceryItem); // Delete specific grocery item

module.exports = router;
