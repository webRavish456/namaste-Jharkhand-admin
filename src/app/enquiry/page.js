'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { Search, VisibilityOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import View from "@/components/enquiry/view";

const Enquiry = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [enquiryData, setEnquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(loading)
    {
        setIsClient(true);
        fetchEnquiries();
    }
  }, [loading]);

  // API Functions
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquiries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch enquiries');
      const data = await response.json();
      setEnquiryData(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update enquiry status');
      await fetchEnquiries(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error updating enquiry status:', err);
      return false;
    }
  };

  const deleteEnquiry = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete enquiry');
      await fetchEnquiries(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      return false;
    }
  };

  // Dialog states
  const [viewShow, setViewShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const filteredEnquiries = enquiryData.filter(enquiry =>
    enquiry.name.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.message.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.status.toLowerCase().includes(search.toLowerCase())
  );

  // Dialog handlers
  const handleClose = () => {
    setViewShow(false);
    setSelectedData(null);
  };

  const handleView = (item) => {
    setSelectedData(item);
    setViewShow(true);
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ color: '#666' }}>
            Loading...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" sx={{ color: 'error.main' }}>
            Error: {error}
          </Typography>
          <Button onClick={fetchEnquiries} variant="contained">
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      
      {/* Search */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
      </Box>

      {/* Enquiries Table - Read Only */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnquiries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((enquiry, index) => (
                  <TableRow 
                    key={enquiry._id || `enquiry-${index}`}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {enquiry.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {enquiry.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {enquiry.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                        {enquiry.message.length > 50 
                          ? `${enquiry.message.substring(0, 50)}...` 
                          : enquiry.message
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 
                            enquiry.status === 'pending' ? '#fff3cd' :
                            enquiry.status === 'read' ? '#d1ecf1' :
                            enquiry.status === 'replied' ? '#d4edda' : '#f8d7da',
                          color: 
                            enquiry.status === 'pending' ? '#856404' :
                            enquiry.status === 'read' ? '#0c5460' :
                            enquiry.status === 'replied' ? '#155724' : '#721c24',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {enquiry.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ display: "flex", gap: "0.25rem" }}
                      >
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleView(enquiry)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
             Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} items
            </Typography>
            <Pagination
              count={Math.ceil(filteredEnquiries.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        open={viewShow}
        onClose={handleClose}
        dialogTitle="View Enquiry Details"
        dialogContent={
          viewShow ? (
            <View selectedData={selectedData} />
          ) : null
        }
        primaryAction={false}
        secondaryActionText="Close"
        showActions={false}
        maxWidth="md"
        fullWidth={true}
      />
    </div>
  );
};

export default Enquiry;
