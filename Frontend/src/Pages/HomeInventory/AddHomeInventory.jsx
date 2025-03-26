import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid
} from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import Sidebar from '../../Components/inventory_sidebar';

const AddHomeInventory = () => {
  // State for form fields
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('Good');
  const [warrantyExpiration, setWarrantyExpiration] = useState('');
  const [notes, setNotes] = useState('');

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Categories for dropdown
  const categories = [
    'Furniture', 'Electronics', 'Kitchen Appliances', 
    'Home Decor', 'Tools', 'Clothing', 'Other'
  ];

  // Condition options
  const conditionOptions = [
    'New', 'Good', 'Fair', 'Needs Repair', 'Broken'
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!itemName || !itemName.trim()) newErrors.itemName = "Item Name is required.";
    if (!category && touched.category) newErrors.category = "Category is required.";
    if (quantity <= 0) newErrors.quantity = "Quantity must be at least 1.";
    if (price && isNaN(parseFloat(price))) newErrors.price = "Price must be a number.";
    if (!condition) newErrors.condition = "Condition is required.";
    
    return newErrors;
  };

  // Handle field touch
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Form validation effect
  useEffect(() => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [itemName, category, quantity, price, condition, touched]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Force required fields to be marked as touched
    setTouched({
      category: true
    });
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // Get user data from localStorage
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
  
      if (!userId || !username) {
        throw new Error('User information not found. Please login again.');
      }
  
      const newHomeInventoryItem = {
        itemName,
        category,
        quantity,
        purchaseDate: purchaseDate ? new Date(purchaseDate).toISOString() : null,
        price: price ? parseFloat(price) : null,
        brand,
        condition,
        warrantyExpiration: warrantyExpiration ? new Date(warrantyExpiration).toISOString() : null,
        notes,
        userId,        // Add user ID from localStorage
        addedBy: username  // Add username from localStorage
      };
  
      const response = await axios.post('http://localhost:3001/inventory/inventory', newHomeInventoryItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      swal("Success", "Home inventory item added successfully!", "success");
      
      // Reset form fields
      setItemName('');
      setCategory('');
      setQuantity(1);
      setPurchaseDate('');
      setPrice('');
      setBrand('');
      setCondition('Good');
      setWarrantyExpiration('');
      setNotes('');
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Error adding home inventory item:', error);
      swal("Error", error.response?.data?.message || error.message || "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Box>
      <Box display="flex" style={{backgroundColor: '#f5f5f5'}}>
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            flex: 1, 
            margin: '15px' 
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            style={{ 
              fontFamily: 'cursive', 
              fontWeight: 'bold', 
              color: 'purple', 
              textAlign: 'center', 
              marginTop:'30px', 
              marginBottom:'50px' 
            }}
          >
            Add Home Inventory Item
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Item Name"
                      variant="outlined"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      onBlur={() => handleBlur('itemName')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      margin="normal" 
                      variant="outlined" 
                      error={touched.category && !!errors.category} 
                      required
                    >
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onBlur={() => handleBlur('category')}
                        label="Category"
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.category && errors.category && (
                        <FormHelperText>{errors.category}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Quantity"
                      type="number"
                      variant="outlined"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                      inputProps={{ min: 1 }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Purchase Date"
                      type="date"
                      variant="outlined"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        inputProps: { 
                          max: getCurrentDate() // Prevent future dates
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Price"
                      type="number"
                      variant="outlined"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      error={!!errors.price}
                      helperText={errors.price}
                      inputProps={{ step: 0.01, min: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Warranty Expiration"
                      type="date"
                      variant="outlined"
                      value={warrantyExpiration}
                      onChange={(e) => setWarrantyExpiration(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Brand"
                      variant="outlined"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      margin="normal" 
                      variant="outlined" 
                      error={!!errors.condition} 
                      required
                    >
                      <InputLabel>Condition</InputLabel>
                      <Select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        label="Condition"
                      >
                        {conditionOptions.map((cond) => (
                          <MenuItem key={cond} value={cond}>
                            {cond}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.condition}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Notes"
                      variant="outlined"
                      multiline
                      rows={6}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional details or description"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 24 }}
              disabled={!isFormValid}
            >
              Add Home Inventory Item
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddHomeInventory;