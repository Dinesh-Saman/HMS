import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../Components/inventory_sidebar';
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
  conditionText: {
    padding: '4px 8px',
    borderRadius: '16px',
    display: 'inline-block',
    fontWeight: '500',
    fontSize: '0.8125rem',
  },
  newCondition: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  goodCondition: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  fairCondition: {
    backgroundColor: '#fff8e1',
    color: '#ff8f00',
  },
  poorCondition: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  }
}));

const HomeInventoryReport = () => {
  const classes = useStyles();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('Authentication required. Please login again.');
        }

        const response = await axios.get('http://localhost:3001/inventory/inventory', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            userId: userId
          }
        });
        
        if (Array.isArray(response.data.items)) {
          setInventoryData(response.data.items);
        } else {
          console.error("Unexpected API response format:", response.data);
          setInventoryData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setError('Failed to load inventory data.');
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Hide the buttons before capturing
    const downloadButtons = document.getElementById('download-buttons');
    if (downloadButtons) {
      downloadButtons.style.display = 'none';
    }
    
    try {
      // Add delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff'
      });
      
      // Restore the buttons
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
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
      
      doc.save('home_inventory_report.pdf');
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
      const excelData = inventoryData.map(item => ({
        'Item Name': item.itemName,
        'Category': item.category,
        'Quantity': item.quantity,
        'Purchase Date': item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A',
        'Price': item.price ? `$${item.price.toFixed(2)}` : 'N/A',
        'Brand': item.brand || 'N/A',
        'Condition': item.condition,
        'Warranty Expiration': item.warrantyExpiration ? new Date(item.warrantyExpiration).toLocaleDateString() : 'N/A',
        'Total Value': item.price && item.quantity ? `$${(item.price * item.quantity).toFixed(2)}` : 'N/A',
        'Notes': item.notes || 'N/A'
      }));
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Home Inventory');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'home_inventory_report.xlsx');
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

  const getConditionClass = (condition) => {
    switch (condition) {
      case 'New': return classes.newCondition;
      case 'Good': return classes.goodCondition;
      case 'Fair': return classes.fairCondition;
      default: return classes.poorCondition;
    }
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
          <img 
            src={letterheadImage} 
            alt="Letterhead" 
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              borderBottom: '2px solid #6a1b9a', 
              boxSizing: 'border-box',
            }} 
          />
          
          <Typography variant="h4" gutterBottom style={{ 
            marginBottom: '20px', 
            fontFamily: 'cursive', 
            fontWeight: 'bold', 
            color: 'purple', 
            textAlign: 'center' 
          }}>
            Home Inventory Report
          </Typography>
          
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableHeadCell}><strong>Item Name</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Category</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Quantity</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Purchase Date</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Price</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Condition</strong></TableCell>
                  <TableCell className={classes.tableHeadCell}><strong>Total Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item._id} className={classes.tableRow}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                    <TableCell>${item.price ? item.price.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`${classes.conditionText} ${getConditionClass(item.condition)}`}>
                        {item.condition}
                      </span>
                    </TableCell>
                    <TableCell>
                      ${item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box className={classes.buttonContainer} id="download-buttons">
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/view-home-inventory')}
            >
              Back to Inventory
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeInventoryReport;