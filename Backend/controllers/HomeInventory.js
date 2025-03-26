const HomeInventory = require('../models/HomeInventory');

// Add a new home inventory item
exports.addHomeInventoryItem = async (req, res) => {
    try {
        const { 
            itemName, 
            category, 
            quantity, 
            purchaseDate, 
            price, 
            brand, 
            itemLocation, 
            condition, 
            warrantyExpiration, 
            notes, 
            userId,     
            addedBy
        } = req.body;

        const newHomeInventoryItem = new HomeInventory({
            itemName,
            category,
            quantity: quantity || 1,
            purchaseDate,
            price,
            brand,
            itemLocation,
            condition: condition || 'Good',
            warrantyExpiration,
            notes,
            userId,     
            addedBy
        });

        const savedItem = await newHomeInventoryItem.save();

        res.status(201).json({
            success: true,
            message: 'Home inventory item added successfully',
            item: savedItem
        });
    } catch (error) {
        console.error('Error adding home inventory item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error adding home inventory item', 
            error: error.message 
        });
    }
};

exports.getAllHomeInventoryItems = async (req, res) => {
    try {
        let query = {};

        const items = await HomeInventory.find(query);
        res.status(200).json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// Get a single home inventory item by ID
exports.getHomeInventoryItemById = async (req, res) => {
    try {
        const { id } = req.params; // Get both IDs from URL parameters
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: 'ID is required' 
            });
        }

        const item = await HomeInventory.findOne({ 
            _id: id
        });

        if (!item) {
            return res.status(404).json({ 
                success: false,
                message: 'Home inventory item not found' 
            });
        }

        res.status(200).json({
            success: true,
            item: item
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching home inventory item', 
            error: error.message 
        });
    }
};

// Update a home inventory item
exports.updateHomeInventoryItem = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const { 
            itemName, 
            category, 
            quantity, 
            purchaseDate, 
            price, 
            brand, 
            itemLocation, 
            condition, 
            warrantyExpiration, 
            notes 
        } = req.body;

        // Validate required fields
        if (!itemName || !category) {
            return res.status(400).json({
                success: false,
                message: 'Item name and category are required'
            });
        }

        // Find and update the item, ensuring it belongs to the current user
        const updatedItem = await HomeInventory.findOneAndUpdate(
            { 
                _id: id
            }, 
            { 
                itemName, 
                category, 
                quantity, 
                purchaseDate, 
                price, 
                brand, 
                itemLocation, 
                condition, 
                warrantyExpiration, 
                notes,
                lastUpdated: Date.now()
            }, 
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run model validations
            }
        );

        if (!updatedItem) {
            return res.status(404).json({ 
                success: false,
                message: 'Home inventory item not found or you are not authorized to update it' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Home inventory item updated successfully',
            item: updatedItem
        });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating home inventory item', 
            error: error.message 
        });
    }
};

// Delete a home inventory item
exports.deleteHomeInventoryItem = async (req, res) => {

    const { id } = req.params;
    try {
        const deletedItem = await HomeInventory.findOneAndDelete({ 
            _id: id
        });

        if (!deletedItem) {
            return res.status(404).json({ 
                success: false,
                message: 'Home inventory item not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Home inventory item deleted successfully',
            item: deletedItem
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error deleting home inventory item', 
            error: error.message 
        });
    }
};

// Search and Filter Methods
exports.searchHomeInventoryItems = async (req, res) => {
    try {
        const { 
            category, 
            itemLocation, 
            condition, 
            minPrice, 
            maxPrice 
        } = req.query;

        // Build search query for current user
        const searchQuery = { userId: req.user._id };

        if (category) searchQuery.category = category;
        if (itemLocation) searchQuery.itemLocation = itemLocation;
        if (condition) searchQuery.condition = condition;
        
        if (minPrice || maxPrice) {
            searchQuery.price = {};
            if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
            if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
        }

        const items = await HomeInventory.find(searchQuery);

        res.status(200).json({
            success: true,
            count: items.length,
            items: items
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error searching home inventory items', 
            error: error.message 
        });
    }
};