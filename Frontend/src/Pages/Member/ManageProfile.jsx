import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
  CircularProgress
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const ManageProfile = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    username: '',
    email: '',
    profilePic: '',
    bio: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch member data on component mount
  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/member-management/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMember({
          username: response.data.username,
          email: response.data.email,
          profilePic: response.data.profilePic,
          bio: response.data.bio || ''
        });
        
        if (response.data.profilePic) {
          setProfilePicturePreview(response.data.profilePic);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        swal("Error", "Failed to load profile data", "error");
        setIsLoading(false);
      }
    };

    fetchMemberProfile();
  }, []);

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        profilePicture: "Only JPG, JPEG, and PNG files are allowed"
      }));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prevErrors => ({
        ...prevErrors,
        profilePicture: "File size must be less than 2MB"
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
      setMember(prev => ({
        ...prev,
        profilePic: reader.result
      }));
    };
    reader.readAsDataURL(file);
    setErrors(prevErrors => ({ ...prevErrors, profilePicture: '' }));
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setProfilePicturePreview('');
    setMember(prev => ({
      ...prev,
      profilePic: ''
    }));
  };

  // Validate email format
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setMember(prev => ({ ...prev, email: value }));

    if (value && !validateEmail(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Invalid email format"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!member.username) newErrors.username = "Username is required.";
    if (!member.email) newErrors.email = "Email is required.";
    else if (!validateEmail(member.email)) newErrors.email = "Invalid email format.";
    
    // Only validate passwords if they're provided
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        username: member.username,
        email: member.email,
        profilePic: member.profilePic,
        bio: member.bio
      };
      
      // Only include password if it was changed
      if (password) {
        updateData.password = password;
      }

      const response = await axios.put(
        'http://localhost:3001/member-management/profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update username in localStorage after successful update
      localStorage.setItem('username', member.username);

      swal("Success", "Profile updated successfully!", "success");
      
      // Clear password fields after successful update
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.status === 409) {
        swal("Error", error.response.data.message, "error");
        if (error.response.data.message.includes("email")) {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: "This email is already registered"
          }));
        } else if (error.response.data.message.includes("username")) {
          setErrors(prevErrors => ({
            ...prevErrors,
            username: "This username is already taken"
          }));
        }
      } else {
        swal("Error", "Failed to update profile", "error");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/member-management/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear ALL user-related data from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      
      swal("Success", "Your account has been deleted", "success")
        .then(() => {
          navigate('/login');
        });
    } catch (error) {
      console.error('Error deleting profile:', error);
      swal("Error", "Failed to delete account", "error");
    }
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/modern-kitchen-design-interior_23-2150954756.jpg?t=st=1743030901~exp=1743034501~hmac=e653e4fd68c13c9aed82dd63619f923a1efe093648a7d38ecb5cba9651cc4be7&w=1380)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Box
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 8,
          boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '550px',
          padding: '30px',
          margin: '40px 0'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          style={{
            fontFamily: 'cursive',
            fontWeight: 'bold',
            color: '#6a1b9a',
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Manage Profile
        </Typography>

        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={3}
          >
            <Typography variant="subtitle1" gutterBottom>
              Profile Picture
            </Typography>
            
            <Box mb={2}>
              <Avatar
                src={profilePicturePreview}
                style={{
                  width: 120,
                  height: 120,
                  border: '2px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                alt={member.username || "Profile"}
              />
            </Box>
            
            <Box display="flex" alignItems="center">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="profile-picture-upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  style={{ marginRight: 8 }}
                >
                  Upload
                </Button>
              </label>
              
              {profilePicturePreview && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveProfilePicture}
                  size="small"
                >
                  Remove
                </Button>
              )}
            </Box>
            
            {errors.profilePicture && (
              <Typography
                variant="caption"
                color="error"
                style={{ marginTop: 8 }}
              >
                {errors.profilePicture}
              </Typography>
            )}
            
            <Typography variant="caption" style={{ marginTop: 8, color: '#666' }}>
              Recommended: Square image, JPG or PNG, max 2MB
            </Typography>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={member.username}
            onChange={(e) => setMember(prev => ({ ...prev, username: e.target.value }))}
            helperText={errors.username}
            error={!!errors.username}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={member.email}
            onChange={handleEmailChange}
            helperText={errors.email}
            error={!!errors.email}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="New Password (leave blank to keep current)"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={errors.password || "Minimum 6 characters if changing"}
            error={!!errors.password}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={errors.confirmPassword}
            error={!!errors.confirmPassword}
          />

          <Box mt={2} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              About You
            </Typography>
            <TextareaAutosize
              minRows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '0.875rem'
              }}
              placeholder="Tell us about yourself..."
              value={member.bio}
              onChange={(e) => setMember(prev => ({ ...prev, bio: e.target.value }))}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            style={{ marginTop: 25, marginBottom: 15 }}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            style={{ marginTop: 15 }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Your Account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone. 
            All your data will be permanently removed from our systems.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProfile} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageProfile;