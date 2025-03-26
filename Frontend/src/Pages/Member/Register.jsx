import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Avatar,
  IconButton,
  TextareaAutosize,
  FormHelperText
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const MemberRegistration = () => {
  // State variables for form fields (only those in the model)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      username,
      email,
      password,
      confirmPassword
    };

    // Check if all required fields have values
    const valid = Object.values(requiredFields).every(field => field !== '' && field !== null);

    // Check if passwords match
    const passwordsMatch = password === confirmPassword;

    setIsFormValid(valid && passwordsMatch);
  }, [username, email, password, confirmPassword]);

  // Validate email format
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation for email
    if (value && !validateEmail(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Invalid email format"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

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
      setProfilePicture(reader.result); // Store base64 string
    };
    reader.readAsDataURL(file);
    setErrors(prevErrors => ({ ...prevErrors, profilePicture: '' }));
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setProfilePicture('');
    setProfilePicturePreview('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newMember = {
      username,
      email,
      password,
      profilePic: profilePicture,
      bio
      // createdAt will be automatically added by the model
    };

    try {
      const response = await axios.post('http://localhost:3001/member-management/register', newMember);

      swal("Success", "Member registered successfully!", "success")
        .then(() => {
          // Reset form
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setProfilePicture('');
          setProfilePicturePreview('');
          setBio('');
          setErrors({});

          // Navigate to login page
          navigate('/login');
        });
    } catch (error) {
      console.error(error);
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
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/beautiful-woman-having-fun-breakfast-christmas-morning_132075-10829.jpg?t=st=1743029745~exp=1743033345~hmac=42ee06e932b2a5c1865c08c580d9e8f0e6f3b3c2523ce45a404aa821ac57d8b8&w=996)',
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
        {/* Title Section */}
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
          Member Registration
        </Typography>

        {/* Form Section */}
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
            
            {/* Profile Picture Preview */}
            <Box mb={2}>
              <Avatar
                src={profilePicturePreview}
                style={{
                  width: 120,
                  height: 120,
                  border: '2px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                alt={username || "Profile"}
              />
            </Box>
            
            {/* Upload and Remove Buttons */}
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
            
            {/* Error Message */}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={errors.username}
            error={!!errors.username}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            helperText={errors.email}
            error={!!errors.email}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={errors.password || "Minimum 6 characters"}
            error={!!errors.password}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={errors.confirmPassword}
            error={!!errors.confirmPassword}
            required
          />

          <Box mt={2} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Tell us about yourself (Optional)
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
              placeholder="Share your interests, hobbies, or why you're joining..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            style={{ marginTop: 25 }}
            disabled={!isFormValid}
          >
            Join Now
          </Button>
          
          {/* Login link */}
          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              Already a member?{' '}
              <Link href="/login" style={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MemberRegistration;