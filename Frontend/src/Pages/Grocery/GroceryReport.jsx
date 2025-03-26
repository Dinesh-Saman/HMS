import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../Components/grocery_sidebar';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Grid
} from '@material-ui/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import letterheadImage from '../../Images/letterhead.png'; 
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    minHeight: '100vh',
    position: 'relative',
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
  },
  tableHeadRow: {
    backgroundColor: '#6a1b9a',
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  purchasedStatus: {
    color: '#4CAF50',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  notPurchasedStatus: {
    color: '#F44336',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  iconCell: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing(1),
    }
  },
  summaryContainer: {
    marginBottom: theme.spacing(12),
    width: '100%',
  },
  summaryTitle: {
    marginBottom: theme.spacing(3),
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryCard: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: '16px !important',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1) !important',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15) !important',
    },
  },
  totalCard: {
    background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
    borderColor: '#4CAF50',
    '&:hover': {
      borderColor: '#388E3C',
    },
  },
  purchasedCard: {
    background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
    borderColor: '#8BC34A',
    '&:hover': {
      borderColor: '#689F38',
    },
  },
  toPurchaseCard: {
    background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
    borderColor: '#FF9800',
    '&:hover': {
      borderColor: '#F57C00',
    },
  },
  summaryIcon: {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  summaryNumber: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  purchasedNumber: {
    color: '#4CAF50',
  },
  toPurchaseNumber: {
    color: '#FF9800',
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    fontWeight: '500',
  },
}));


const GroceryReport = () => {
  const classes = useStyles();
  const [groceryData, setGroceryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroceryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('Authentication required. Please login again.');
        }

        const response = await axios.get('http://localhost:3001/grocery-item-management/api', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            userId: userId
          }
        });
        
        if (Array.isArray(response.data.groceryItems)) {
          setGroceryData(response.data.groceryItems);
        } else {
          console.error("Unexpected API response format:", response.data);
          setGroceryData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grocery data:', error);
        setError('Failed to load grocery data.');
        setLoading(false);
      }
    };

    fetchGroceryData();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Hide the buttons before capturing
    const downloadButtons = document.getElementById('download-buttons');
    if (downloadButtons) {
      downloadButtons.style.display = 'none';
    }
    
    try {
      // Add a small delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        async: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Restore the buttons
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const margin = 2;
      doc.addImage(imgData, 'PNG', margin, margin, imgWidth - (margin * 2), imgHeight - (margin * 2));
      
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, -(position + margin), imgWidth - (margin * 2), imgHeight - (margin * 2));
        heightLeft -= pageHeight;
      }
      
      doc.save('grocery_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Prepare the data for Excel
      const excelData = groceryData.map(item => ({
        'Item Name': item.name,
        'Quantity': item.quantity,
        'Unit': item.unit,
        'Status': item.purchased ? 'Purchased' : 'Not Purchased',
        'Date Added': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
        'Last Updated': item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'
      }));
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Grocery Items');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Save the file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'grocery_report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
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

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box 
          ref={reportRef}
          className={classes.contentContainer}
          id="printable-section"
        >
          {/* Letterhead image */}
          <img 
            src={letterheadImage} 
            alt="Letterhead" 
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              borderBottom: '2px solid #4CAF50', 
              boxSizing: 'border-box',
            }} 
          />
          
          {/* Page Title */}
          <Typography variant="h4" gutterBottom style={{ 
            marginBottom: '20px', 
            fontFamily: 'cursive', 
            fontWeight: 'bold', 
            color: 'purple', 
            textAlign: 'center' 
          }}>
            Grocery Items Report
          </Typography>
          
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}><strong>Item</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Name</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Quantity</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Unit</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Status</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Date Added</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groceryData.map((item) => (
                  <TableRow key={item._id} className={classes.tableRow}>
                    <TableCell>
                      <div className={classes.iconCell}>
                        <LocalGroceryStoreIcon color="primary" />
                      </div>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      {item.purchased ? (
                        <div className={classes.purchasedStatus}>
                          <CheckCircleIcon style={{ marginRight: 4 }} />
                          Purchased
                        </div>
                      ) : (
                        <div className={classes.notPurchasedStatus}>
                          <CancelIcon style={{ marginRight: 4 }} />
                          Not Purchased
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Enhanced Summary Statistics */}
          <Box className={classes.summaryContainer}>
            <Typography variant="h5" className={classes.summaryTitle}>
              SUMMARY STATISTICS
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper className={`${classes.summaryCard} ${classes.totalCard}`}>
                  <LocalGroceryStoreIcon className={classes.summaryIcon} />
                  <Typography variant="h2" className={classes.summaryNumber}>
                    {groceryData.length}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.summaryLabel}>
                    Total Items
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={`${classes.summaryCard} ${classes.purchasedCard}`}>
                  <CheckCircleIcon className={classes.summaryIcon} />
                  <Typography variant="h2" className={`${classes.summaryNumber} ${classes.purchasedNumber}`}>
                    {groceryData.filter(item => item.purchased).length}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.summaryLabel}>
                    Purchased
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={`${classes.summaryCard} ${classes.toPurchaseCard}`}>
                  <CancelIcon className={classes.summaryIcon} />
                  <Typography variant="h2" className={`${classes.summaryNumber} ${classes.toPurchaseNumber}`}>
                    {groceryData.filter(item => !item.purchased).length}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.summaryLabel}>
                    To Purchase
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          <Box className={classes.buttonContainer} id="download-buttons">
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownloadPDF}
              startIcon={<LocalGroceryStoreIcon />}
            >
              Download PDF
            </Button>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={handleDownloadExcel}
              startIcon={<LocalGroceryStoreIcon />}
            >
              Download Excel
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/view-grocery-items')}
            >
              Back to Grocery List
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GroceryReport;