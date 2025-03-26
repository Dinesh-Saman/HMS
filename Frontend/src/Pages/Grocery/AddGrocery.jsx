import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, Checkbox, FormControlLabel
} from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import Sidebar from '../../Components/grocery_sidebar';
import { useNavigate } from 'react-router-dom';

const AddGroceryItem = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [purchased, setPurchased] = useState(false);
  
  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Unit options
  const unitOptions = ['kg', 'liters', 'pcs', 'pack'];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!name || !name.trim()) newErrors.name = "Item name is required.";
    if (quantity <= 0) newErrors.quantity = "Quantity must be at least 1.";
    if (!unit) newErrors.unit = "Unit is required.";
    
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
  }, [name, quantity, unit, touched]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Force required fields to be marked as touched
    setTouched({
      name: true,
      unit: true
    });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Get user data from localStorage
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');

      if (!userId || !username) {
        throw new Error('User information not found. Please login again.');
      }

      const newGroceryItem = {
        name,
        quantity,
        unit,
        purchased,
        addedBy: userId
      };

      const response = await axios.post('http://localhost:3001/grocery-item-management/api', newGroceryItem, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      swal("Success", "Grocery item added successfully!", "success")
        .then(() => {
          navigate('/view-grocery-items');
        });
      
    } catch (error) {
      console.error('Error adding grocery item:', error);
      swal("Error", error.response?.data?.message || error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
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
            Add Grocery Item
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left side - Form fields */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Item Name"
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur('name')}
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      required
                    />
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
                      onBlur={() => handleBlur('quantity')}
                      error={touched.quantity && !!errors.quantity}
                      helperText={touched.quantity && errors.quantity}
                      inputProps={{ min: 1 }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      margin="normal" 
                      variant="outlined" 
                      error={touched.unit && !!errors.unit} 
                      required
                    >
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        onBlur={() => handleBlur('unit')}
                        label="Unit"
                      >
                        {unitOptions.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.unit && errors.unit && (
                        <FormHelperText>{errors.unit}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={purchased}
                          onChange={(e) => setPurchased(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Already Purchased?"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right side - Grocery image */}
              <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box 
                  style={{ 
                    width: '90%', 
                    height: '90%', 
                    backgroundImage: 'url(https://media.istockphoto.com/id/171302954/photo/groceries.jpg?s=612x612&w=0&k=20&c=D3MmhT5DafwimcYyxCYXqXMxr1W25wZnyUf4PF1RYw8=)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 8,
                    minHeight: 300
                  }}
                >
                  </Box>
                
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-start" mt={3} gap={2}>
            <Box display="flex" justifyContent="flex-start" mt={3}>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/grocery')}
                style={{ marginRight: 16 }}  // Manual spacing for v4
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? 'Adding...' : 'Add Grocery Item'}
            </Button>
            </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddGroceryItem;