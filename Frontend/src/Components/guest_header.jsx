import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useNavigate } from 'react-router-dom';
import './guest_header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('User');
  const [loginType, setLoginType] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLoginUpdate = (event) => {
      const { username: newUsername, email } = event.detail;
      
      if (email === 'admin@gmail.com') {
        setUsername('Admin');
        setLoginType('admin');
      } else if (newUsername) {
        setUsername(newUsername);
        setLoginType('user');
      } else {
        setUsername('User');
        setLoginType('');
      }
    };

    window.addEventListener('loginUpdate', handleLoginUpdate);

    // Initial check from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');

    if (storedEmail === 'admin@gmail.com') {
      setUsername('Admin');
      setLoginType('admin');
    } else if (storedUsername) {
      setUsername(storedUsername);
      setLoginType('user');
    }

    return () => {
      window.removeEventListener('loginUpdate', handleLoginUpdate);
    };
  }, []);

  // Handle profile icon click
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('loginUpdate', {
      detail: { username: 'User', email: '' }
    }));
    
    handleClose();
    navigate('/login');
  };

  // If refreshing, show loading or return null
  if (isRefreshing) {
    return <div>Refreshing...</div>;
  }

  return (
    <Box className="header-container">
      <Box className="guest_header">
        <Box className="contact-section">
          <Typography variant="body1">
            HomeStock <br />
            Call Now: <br />
            0717901354 / 0703399599
          </Typography>
        </Box>

        <Box className="logo-section">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2020/04/house-apartment-logo-blue-png-transparent.png"
              alt="Logo"
              className="logo"
            />
          </Link>
        </Box>

        <Box className="icon-section">
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>

          {/* User Profile Section */}
          <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
            Hi, {username}
          </Typography>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="User Avatar"
              style={{ width: 40, height: 40 }}
            />
          </IconButton>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            getContentAnchorEl={null}
          >
            {loginType === 'admin' && (
              <>
                <MenuItem onClick={() => navigate('/login')}>User Login</MenuItem>
                <MenuItem onClick={handleLogout}>Logout Admin</MenuItem>
              </>
            )}

            {loginType === 'user' && (
              <>
                <MenuItem onClick={() => navigate('/dashboard')}>My Dashboard</MenuItem>
                <MenuItem onClick={() => navigate('/profile')}>View Profile</MenuItem>
                <MenuItem onClick={() => navigate('/edit-profile')}>Edit Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout User</MenuItem>
              </>
            )}

            {loginType === '' && (
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;