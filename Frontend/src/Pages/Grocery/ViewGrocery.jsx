import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, Avatar, 
  Chip, IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider , Button  
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/grocery_sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EventIcon from '@material-ui/icons/Event';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
    borderRadius: 8,
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  tableHeadRow: {
    backgroundColor: '#6a1b9a',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemAvatar: {
    width: 60,
    height: 60,
    backgroundColor: theme.palette.secondary.main,
    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
    border: '2px solid white',
  },
  cardHeader1: {
    backgroundColor: '#8BC34A', // Light Green
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeader2: {
    backgroundColor: '#FFC107', // Amber
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeader3: {
    backgroundColor: '#FF9800', // Orange
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1.5, 0),
    '& svg': {
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
  },
  infoLabel: {
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    minWidth: 90,
  },
  infoValue: {
    color: theme.palette.text.primary,
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  editButton: {
    backgroundColor: '#2196F3', // Blue
    color: 'white',
    '&:hover': {
      backgroundColor: '#1976D2',
    },
  },
  purchasedChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  notPurchasedChip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#F44336',
    color: 'white'
  }
}));

const ViewGroceryItems = () => {
  const classes = useStyles();
  const [groceryData, setGroceryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroceryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('userId');
        
        if (!token || !username) {
          throw new Error('Authentication required. Please login again.');
        }
  
        const response = await axios.get('http://localhost:3001/grocery-item-management/api', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (Array.isArray(response.data.groceryItems)) {
          // Filter items to show only those added by the logged-in user
          const userItems = response.data.groceryItems.filter(item => item.addedBy === username);
          setGroceryData(userItems);
        } else {
          console.error("Unexpected API response format:", response.data);
          setGroceryData([]);
        }
      } catch (error) {
        console.error("Error fetching grocery data!", error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load grocery items',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setGroceryData([]);
      }
    };
  
    fetchGroceryData();
  }, []);

  const handleDelete = async (itemId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/grocery-item-management/api/${itemId}`);
        setGroceryData(groceryData.filter(item => item._id !== itemId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Grocery item has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("Error deleting grocery item!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting grocery item: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleUpdate = (itemId) => {
    navigate(`/update-grocery-item/${itemId}`);
  };

  const handleTogglePurchased = async (itemId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/grocery-item-management/api/${itemId}`,
        { purchased: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setGroceryData(groceryData.map(item => 
        item._id === itemId ? { ...item, purchased: !currentStatus } : item
      ));
    } catch (error) {
      console.error("Error toggling purchased status:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update purchase status',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
    setSearchQuery("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredGrocery = groceryData.filter(item => {
    if (!searchQuery) return true;
    
    const field = item[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedGrocery = filteredGrocery.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
            marginBottom={3}
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Grocery Items
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="name">Item Name</MenuItem>
                  <MenuItem value="unit">Unit</MenuItem>
                  <MenuItem value="quantity">Quantity</MenuItem>
                  <MenuItem value="purchased">Status</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}></TableCell>
                  <TableCell className={classes.tableHeadCell}>Item Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>Quantity</TableCell>
                  <TableCell className={classes.tableHeadCell}>Unit</TableCell>
                  <TableCell className={classes.tableHeadCell}>Status</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedGrocery.map((item) => (
                  <React.Fragment key={item._id}>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(item._id)}
                          style={{ transform: expandedRow === item._id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell><strong>{item.name}</strong></TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.purchased ? 'Purchased' : 'Not Purchased'} 
                          size="small" 
                          className={item.purchased ? classes.purchasedChip : classes.notPurchasedChip}
                          icon={item.purchased ? <CheckCircleIcon /> : <CancelIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <IconButton
                            className={`${classes.actionButton} ${classes.editButton}`}
                            size="small"
                            onClick={() => handleUpdate(item._id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            className={`${classes.actionButton} ${classes.deleteButton}`}
                            size="small"
                            onClick={() => handleDelete(item._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRow === item._id} timeout="auto" unmountOnExit>
                          <Box p={3} bgcolor="background.paper">
                            <Grid container spacing={3}>
                              {/* Item Details Card (Light Green) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader1}
                                    avatar={<LocalGroceryStoreIcon />}
                                    title="Item Details"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <LocalGroceryStoreIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Name:</Typography>
                                      <Typography className={classes.infoValue}>{item.name}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <ShoppingBasketIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Quantity:</Typography>
                                      <Typography className={classes.infoValue}>{item.quantity} {item.unit}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Status Card (Amber) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader2}
                                    avatar={<CheckCircleIcon />}
                                    title="Purchase Status"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <CheckCircleIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Status:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {item.purchased ? 'Purchased' : 'Not Purchased'}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <EventIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Added On:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {formatDate(item.createdAt)}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Actions Card (Orange) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader3}
                                    avatar={<EditIcon />}
                                    title="Quick Actions"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleUpdate(item._id)}
                                        fullWidth
                                        style={{marginTop:'14px'}}
                                      >
                                        Edit Item
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(item._id)}
                                        fullWidth
                                        style={{marginTop:'12px'}}
                                      >
                                        Delete Item
                                      </Button>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewGroceryItems;