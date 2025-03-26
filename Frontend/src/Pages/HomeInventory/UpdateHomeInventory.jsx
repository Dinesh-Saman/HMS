import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, CircularProgress
} from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import Sidebar from '../../Components/inventory_sidebar';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateHomeInventory = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: 1,
    purchaseDate: '',
    price: '',
    brand: '',
    condition: 'Good',
    warrantyExpiration: '',
    notes: ''
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Format date from API to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch existing item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/inventory/inventory/${id}`);
        const item = response.data.item;

        setFormData({
          itemName: item.itemName || '',
          category: item.category || '',
          quantity: item.quantity || 1,
          purchaseDate: formatDateForInput(item.purchaseDate),
          price: item.price ? item.price.toString() : '',
          brand: item.brand || '',
          condition: item.condition || 'Good',
          warrantyExpiration: formatDateForInput(item.warrantyExpiration),
          notes: item.notes || ''
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching item details:', error);
        swal("Error", "Could not fetch item details.", "error");
      }
    };

    fetchItemDetails();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required.";
    if (!formData.category && touched.category) newErrors.category = "Category is required.";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be at least 1.";
    if (formData.price && isNaN(parseFloat(formData.price))) newErrors.price = "Price must be a number.";
    if (!formData.condition) newErrors.condition = "Condition is required.";
    
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
  }, [formData, touched]);

  // Submit handler
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
      const updatedHomeInventoryItem = {
        itemName: formData.itemName,
        category: formData.category,
        quantity: formData.quantity,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null,
        price: formData.price ? parseFloat(formData.price) : null,
        brand: formData.brand,
        condition: formData.condition,
        warrantyExpiration: formData.warrantyExpiration ? new Date(formData.warrantyExpiration).toISOString() : null,
        notes: formData.notes
      };

      await axios.put(`http://localhost:3001/inventory/inventory/${id}`, updatedHomeInventoryItem);
      
      swal("Success", "Home inventory item updated successfully!", "success");
      navigate('/view-home-inventory');
    } catch (error) {
      console.error('Error updating home inventory item:', error);
      swal("Error", error.response?.data?.message || "Something went wrong. Please try again.", "error");
    }
  };

  // Cancel update and go back
  const handleCancel = () => {
    navigate('/view-home-inventory');
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
            Update Home Inventory Item
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
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('itemName')}
                      error={!!errors.itemName}
                      helperText={errors.itemName}
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
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
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
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
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
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        inputProps: { 
                          max: getCurrentDate()
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
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
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
                      name="warrantyExpiration"
                      value={formData.warrantyExpiration}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Brand"
                      variant="outlined"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
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
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
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
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Additional details or description"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-start" mt={3}>
              <Button
              fullWidth
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleCancel}
                style={{ marginRight: 16 }}
              >
                Cancel
              </Button>
              <Button
              fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!isFormValid}
              >
                Update Home Inventory Item
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateHomeInventory;