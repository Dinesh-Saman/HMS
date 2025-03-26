import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, MenuItem, FormControl, Select, InputLabel, Avatar, 
  Chip, IconButton, Collapse, Grid, Card, CardContent, CardHeader, Divider 
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/inventory_sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CategoryIcon from '@material-ui/icons/Category';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BuildIcon from '@material-ui/icons/Build';
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
    backgroundColor: '#3f51b5', // Indigo
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeader2: {
    backgroundColor: '#009688', // Teal
    color: 'white',
    padding: theme.spacing(1.5),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeader3: {
    backgroundColor: '#ff5722', // Deep Orange
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
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#2E7D32',
    },
  },
  conditionChip: {
    margin: theme.spacing(0.5),
  }
}));

const ViewHomeInventory = () => {
  const classes = useStyles();
  const [inventoryData, setInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("itemName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (!token || !username) {
          throw new Error('Authentication required. Please login again.');
        }
  
        const response = await axios.get('http://localhost:3001/inventory/inventory', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (Array.isArray(response.data.items)) {
          // Filter items to show only those added by the logged-in user
          const userItems = response.data.items.filter(item => item.addedBy === username);
          setInventoryData(userItems);
        } else {
          console.error("Unexpected API response format:", response.data);
          setInventoryData([]);
        }
      } catch (error) {
        console.error("Error fetching inventory data!", error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load inventory items',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setInventoryData([]);
      }
    };
  
    fetchInventoryData();
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
        await axios.delete(`http://localhost:3001/inventory/inventory/${itemId}`);
        setInventoryData(inventoryData.filter(item => item._id !== itemId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Inventory item has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("Error deleting inventory item!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting inventory item: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleUpdate = (itemId) => {
    navigate(`/update-home-inventory/${itemId}`);
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

  const filteredInventory = inventoryData.filter(item => {
    if (!searchQuery) return true;
    
    const field = item[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedInventory = filteredInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Home Inventory
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="itemName">Item Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="brand">Brand</MenuItem>
                  <MenuItem value="condition">Condition</MenuItem>
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
                  <TableCell className={classes.tableHeadCell}>Category</TableCell>
                  <TableCell className={classes.tableHeadCell}>Brand</TableCell>
                  <TableCell className={classes.tableHeadCell}>Quantity</TableCell>
                  <TableCell className={classes.tableHeadCell}>Condition</TableCell>
                  <TableCell className={classes.tableHeadCell}>Price</TableCell>
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((item) => (
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
                      <TableCell><strong>{item.itemName}</strong></TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.brand || 'N/A'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.condition} 
                          size="small" 
                          className={classes.conditionChip}
                          color={
                            item.condition === 'New' ? 'primary' :
                            item.condition === 'Good' ? 'secondary' :
                            item.condition === 'Fair' ? 'default' :
                            'error'
                          }
                        />
                      </TableCell>
                      <TableCell>${item.price ? item.price.toFixed(2) : 'N/A'}</TableCell>
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
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={expandedRow === item._id} timeout="auto" unmountOnExit>
                          <Box p={3} bgcolor="background.paper">
                            <Grid container spacing={3}>
                              {/* Item Details Card (Indigo) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader1}
                                    avatar={<CategoryIcon />}
                                    title="Item Details"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <CategoryIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Category:</Typography>
                                      <Typography className={classes.infoValue}>{item.category}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <LocalOfferIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Brand:</Typography>
                                      <Typography className={classes.infoValue}>{item.brand || 'N/A'}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <BuildIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Quantity:</Typography>
                                      <Typography className={classes.infoValue}>{item.quantity || 'N/A'}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Purchase Info Card (Teal) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader2}
                                    avatar={<EventIcon />}
                                    title="Purchase Information"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <EventIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Purchase:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {formatDate(item.purchaseDate)}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <BuildIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Condition:</Typography>
                                      <Typography className={classes.infoValue}>{item.condition}</Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <EventIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Quantity:</Typography>
                                      <Typography className={classes.infoValue}>{item.quantity}</Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Financial Details Card (Deep Orange) */}
                              <Grid item xs={12} md={4}>
                                <Card>
                                  <CardHeader
                                    className={classes.cardHeader3}
                                    avatar={<LocalOfferIcon />}
                                    title="Financial Details"
                                    titleTypographyProps={{ variant: 'subtitle1' }}
                                  />
                                  <CardContent>
                                    <Box className={classes.infoRow}>
                                      <LocalOfferIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Price:</Typography>
                                      <Typography className={classes.infoValue}>
                                        ${item.price ? item.price.toFixed(2) : 'N/A'}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <EventIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Warranty:</Typography>
                                      <Typography className={classes.infoValue}>
                                        {formatDate(item.warrantyExpiration)}
                                      </Typography>
                                    </Box>
                                    <Divider light />
                                    <Box className={classes.infoRow}>
                                      <BuildIcon fontSize="small" />
                                      <Typography className={classes.infoLabel}>Total:</Typography>
                                      <Typography className={classes.infoValue}>
                                        ${item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : 'N/A'}
                                      </Typography>
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

export default ViewHomeInventory;