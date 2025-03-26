import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Link, IconButton, Card, CardContent, 
  Avatar, Grid, TextField, Paper, Divider 
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBackIos, 
  ArrowForwardIos,
  LocalGroceryStore as LocalGroceryStoreIcon,
  ShoppingBasket as ShoppingBasketIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon, 
  LocationOn as LocationOnIcon 
} from '@material-ui/icons';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Home inventory and grocery management images
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Smart Home Inventory',
      subtitle: 'Digitally catalog all your household items'
    },
    {
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Grocery Management',
      subtitle: 'Track your pantry and shopping lists'
    },
    {
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Household Essentials',
      subtitle: 'Manage and restock your daily necessities'
    },
    {
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Moving Made Easy',
      subtitle: 'Organize your belongings for relocation'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      text: 'HomeStock saved me hours during my recent move. I could track everything from my grandmother\'s china to my power tools with ease!',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Insurance Agent',
      text: 'My clients who use HomeStock have much smoother claims processes. The detailed inventory with photos makes everything verifiable.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Busy Mom',
      text: 'The grocery management feature has cut my shopping time in half. I always know what I have and what I need to buy.',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
    }
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(slideTimer);
  }, [currentSlide, slides.length]);

  // Auto-advance testimonials every 7 seconds
  useEffect(() => {
    const testimonialTimer = setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearTimeout(testimonialTimer);
  }, [currentTestimonial, testimonials.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Box style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* Slideshow Section */}
      <Box style={{ height: '60vh', position: 'relative', overflow: 'hidden' }}>
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1s ease',
            filter: 'brightness(0.8)'
          }}
        />
        
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '0 20px'
          }}
        >
          <Box maxWidth="800px">
            <Typography variant="h2" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
              {slides[currentSlide].title}
            </Typography>
            <Typography variant="h5" style={{ marginBottom: '30px' }}>
              {slides[currentSlide].subtitle}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/register')}
              style={{ padding: '12px 30px', fontWeight: 'bold' }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Navigation Arrows */}
        <IconButton 
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowBackIos />
        </IconButton>
        
        <IconButton 
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Feature Cards Section */}
      <Box 
        style={{ 
          padding: '60px 20px', 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          marginTop: '-50px',
          position: 'relative',
          zIndex: 2,
          borderRadius: '30px 30px 0 0'
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card style={{ height: '100%', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <CardContent style={{ padding: '30px', textAlign: 'center' }}>
                <LocalGroceryStoreIcon style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Home Inventory
                </Typography>
                <Typography variant="body1" style={{ color: '#555' }}>
                  Catalog all your household items with photos, receipts, and warranty information in one secure place.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ height: '100%', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <CardContent style={{ padding: '30px', textAlign: 'center' }}>
                <ShoppingBasketIcon style={{ fontSize: '60px', color: '#2196F3', marginBottom: '20px' }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Grocery Management
                </Typography>
                <Typography variant="body1" style={{ color: '#555' }}>
                  Track pantry items, create shopping lists, and never forget an essential item again.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ height: '100%', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              <CardContent style={{ padding: '30px', textAlign: 'center' }}>
                <HomeIcon style={{ fontSize: '60px', color: '#FF9800', marginBottom: '20px' }} />
                <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                  Household Essentials
                </Typography>
                <Typography variant="body1" style={{ color: '#555' }}>
                  Manage your daily essentials and get reminders for restocking household supplies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box style={{ padding: '100px 20px', backgroundColor: '#6a1b9a', color: 'white' }}>
        <Typography variant="h3" align="center" style={{ marginBottom: '40px', fontWeight: 'bold' }}>
          What Our Users Say
        </Typography>
        
        <Box style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', minHeight: '240px' }}>
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: index === currentTestimonial ? 1 : 0,
                transition: 'opacity 0.5s ease',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <Avatar 
                src={testimonial.avatar} 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  margin: '0 auto 20px',
                  border: '3px solid white'
                }} 
              />
              <Typography variant="h5" style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                "{testimonial.text}"
              </Typography>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {testimonial.name}
              </Typography>
              <Typography variant="subtitle1" style={{ opacity: 0.8 }}>
                {testimonial.role}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

{/* Enhanced Contact Us Section */}
<Box style={{ 
  padding: '100px 20px', 
  backgroundColor: '#f8f9fa',
  backgroundImage: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
}}>
  <Grid container justifyContent="center" spacing={6}>
    <Grid item xs={12} md={6}>
      <Box style={{
        padding: '40px',
        borderRadius: '16px',
        background: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        height: '100%'
      }}>
        <Typography variant="h3" style={{ 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          color: '#2c3e50',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          Get In Touch
        </Typography>
        
        <Typography variant="body1" style={{ 
          marginBottom: '40px', 
          color: '#7f8c8d',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Have questions or feedback? We'd love to hear from you! Our team typically responds within 24 hours.
        </Typography>
        
        <form>
          <TextField
            fullWidth
            label="Your Name"
            variant="outlined"
            margin="normal"
            InputProps={{
              style: {
                borderRadius: '12px',
                backgroundColor: '#f8f9fa'
              }
            }}
            style={{ marginBottom: '20px' }}
          />
          
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            InputProps={{
              style: {
                borderRadius: '12px',
                backgroundColor: '#f8f9fa'
              }
            }}
            style={{ marginBottom: '20px' }}
          />
          
          <TextField
            fullWidth
            label="Your Message"
            variant="outlined"
            margin="normal"
            multiline
            rows={5}
            InputProps={{
              style: {
                borderRadius: '12px',
                backgroundColor: '#f8f9fa'
              }
            }}
            style={{ marginBottom: '30px' }}
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            style={{ 
              marginTop: '10px',
              padding: '15px 40px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px rgba(0,0,0,0.15)'
              }
            }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <Box style={{
        padding: '40px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white',
        height: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h3" style={{ 
          fontWeight: 'bold', 
          marginBottom: '30px',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          Our Information
        </Typography>
        
        <Box style={{ marginBottom: '30px' }}>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <EmailIcon style={{ fontSize: '30px', marginRight: '15px', color: '#ffffff' }} />
            <Box>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Email Us
              </Typography>
              <Typography variant="body1">
                support@homestock.com
              </Typography>
            </Box>
          </Box>
          
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <PhoneIcon style={{ fontSize: '30px', marginRight: '15px', color: '#ffffff' }} />
            <Box>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Call Us
              </Typography>
              <Typography variant="body1">
                (555) 123-4567
              </Typography>
            </Box>
          </Box>
          
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <LocationOnIcon style={{ fontSize: '30px', marginRight: '15px', color: '#ffffff' }} />
            <Box>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Visit Us
              </Typography>
              <Typography variant="body1">
                123 Inventory Lane, Suite 100<br />
                San Francisco, CA 94107
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider style={{ background: 'rgba(255,255,255,0.2)', margin: '30px 0' }} />
        
        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
          Support Hours
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '5px' }}>
          Monday - Friday: 9:00 AM - 5:00 PM PST
        </Typography>
        <Typography variant="body1">
          Saturday - Sunday: Closed
        </Typography>
      </Box>
    </Grid>
  </Grid>
</Box>
    </Box>
  );
};

export default Home;