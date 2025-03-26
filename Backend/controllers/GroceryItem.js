const GroceryItem = require('../models/GroceryItem');
const Member = require('../models/member');

// Add a new grocery item
exports.addGroceryItem = async (req, res) => {
    try {
        const { name, quantity, unit, addedBy, userId, purchased } = req.body;

        // Create new grocery item
        const newGroceryItem = new GroceryItem({
            name,
            quantity,
            unit,
            addedBy,
            purchased,
        });

        // Save the item
        const savedItem = await newGroceryItem.save();

        res.status(201).json({
            message: 'Grocery item added successfully',
            item: savedItem
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding grocery item', 
            error: error.message 
        });
    }
};

// Get all grocery items
exports.getAllGroceryItems = async (req, res) => {
    try {
        let query = {};
        // Find all grocery items for the current member
        const groceryItems = await GroceryItem.find(query);
        res.status(200).json({ success: true, groceryItems });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching grocery items', 
            error: error.message 
        });
    }
};

// Get a single grocery item by ID
exports.getGroceryItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await GroceryItem.findOne({ 
            _id: id, 
        });

        if (!item) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching grocery item', 
            error: error.message 
        });
    }
};

// Update a grocery item
exports.updateGroceryItem = async (req, res) => {
    try {
        const { id } = req.params; 

        const { name, quantity, unit, purchased } = req.body;
        
        // Find and update the item
        const updatedItem = await GroceryItem.findOneAndUpdate(
            { 
                _id: req.params.id, 
            }, 
            { 
                name, 
                quantity, 
                unit, 
                purchased 
            }, 
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run model validations
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        res.status(200).json({
            message: 'Grocery item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating grocery item', 
            error: error.message 
        });
    }
};

// Delete a grocery item
exports.deleteGroceryItem = async (req, res) => {
    const { id } = req.params; 
    try {
        const deletedItem = await GroceryItem.findOneAndDelete({ 
            _id: id, 
        });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Grocery item not found' });
        }

        res.status(200).json({ 
            message: 'Grocery item deleted successfully',
            item: deletedItem
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting grocery item', 
            error: error.message 
        });
    }
};