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
  Button,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import Create from "@/components/explore-jharkhand/create";
import View from "@/components/explore-jharkhand/view";
import Edit from "@/components/explore-jharkhand/edit";
import Delete from "@/components/explore-jharkhand/delete";

const ExploreJharkhand = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [exploreData, setExploreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(loading)
    {
        setIsClient(true);
        fetchExploreData();
    }
  }, [loading]);

  // API Functions
  const fetchExploreData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      // Check if token exists (LayoutWrapper already checks, but double check for safety)
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('admin');
        router.replace('/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch explore data');
      const data = await response.json();
      setExploreData(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createExplore = async (exploreData) => {
    try {
      const formData = new FormData();
      formData.append('exploreImage', exploreData.exploreImage);
      formData.append('title', exploreData.title);
      formData.append('description', exploreData.description);
      formData.append('status', exploreData.status || 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to create explore data');
      await fetchExploreData(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error creating explore data:', err);
      return false;
    }
  };

  const updateExplore = async (id, exploreData) => {
    try {
      const formData = new FormData();
      if (exploreData.exploreImage) formData.append('exploreImage', exploreData.exploreImage);
      formData.append('title', exploreData.title);
      formData.append('description', exploreData.description);
      formData.append('status', exploreData.status || 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update explore data');
      await fetchExploreData(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error updating explore data:', err);
      return false;
    }
  };

  const deleteExplore = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete explore data');
      await fetchExploreData(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error deleting explore data:', err);
      return false;
    }
  };

  // Dialog states
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [formErrors, setFormErrors] = useState({});

  const filteredExploreJharkhand = exploreData.filter(exploreJharkhand =>
    exploreJharkhand.title.toLowerCase().includes(search.toLowerCase())
  );

  // Dialog handlers
  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setSelectedData(null);
    setFormData({
      title: '',
      description: '',
      image: null
    });
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    // For create mode, image is required
    // For edit mode, check if there's existing image or new image selected
    if (openData && !formData.exploreImage) {
      errors.exploreImage = 'Image is required';
    } else if (editShow && !formData.exploreImage && !selectedData?.image) {
      errors.exploreImage = 'Image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }
    
    const success = await createExplore(formData);
    if (success) {
      handleClose();
      alert('Explore Jharkhand created successfully!');
    } else {
      alert('Failed to create explore data. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    
    const success = await updateExplore(selectedData._id, formData);
    if (success) {
      handleClose();
      alert('Explore Jharkhand updated successfully!');
    } else {
      alert('Failed to update explore data. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteExplore(selectedData._id);
    if (success) {
      handleClose();
      alert('Explore Jharkhand deleted successfully!');
    } else {
      alert('Failed to delete explore data. Please try again.');
    }
  };

  const handleView = (item) => {
    setSelectedData(item);
    setViewShow(true);
  };

  const handleEdit = (item) => {
    console.log('handleEdit called with item:', item);
    setSelectedData(item);
    setFormData({
      title: item.title,
      description: item.description,
      exploreImage: item.exploreImage, // Keep existing image for preview
    });
    console.log('FormData set with exploreImage:', item.image);
    setEditShow(true);
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setDeleteShow(true);
  };

  const handleRowClick = (item) => {
    router.push(`/explore-jharkhand/${item._id}`);
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        {/* Search and Create Button Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={200} height={40} />
        </Box>

        {/* Table Skeleton */}
        <Box className="hrms-card">
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Explore Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    <TableCell><Skeleton variant="text" width={30} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={40} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination Skeleton */}
          <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={200} />
              <Skeleton variant="rectangular" width={200} height={32} />
            </Stack>
          </Box>
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
          <Button onClick={fetchExploreData} variant="contained">
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search explore Jharkhand..."
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenData(true)}
          sx={{ 
            height: "40px", 
            textTransform: 'none',
            backgroundColor: '#2b8c54',
            '&:hover': {
              backgroundColor: '#28a745'
            }
          }}
        >
          Add Explore Jharkhand
        </Button>
      </Box>

      {/* Explore Jharkhand Table - Read Only */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Explore Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExploreJharkhand
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((exploreJharkhand, index) => (
                  <TableRow 
                    key={exploreJharkhand._id || `explore-${index}`}
                    onClick={() => handleRowClick(exploreJharkhand)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <img src={exploreJharkhand.exploreImage} alt={exploreJharkhand.title} width={60} height={40} style={{borderRadius: '4px', objectFit: 'cover'}} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {exploreJharkhand.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                        {exploreJharkhand.description.length > 50 
                          ? `${exploreJharkhand.description.substring(0, 50)}...` 
                          : exploreJharkhand.description
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#2e7d32"
                        }}
                      >
                        Active
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ display: "flex", gap: "0.25rem" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleView(exploreJharkhand)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEdit(exploreJharkhand)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDelete(exploreJharkhand)}
                        >
                          <DeleteOutlined />
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
             Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredExploreJharkhand.length)} of {filteredExploreJharkhand.length} items
            </Typography>
            <Pagination
              count={Math.ceil(filteredExploreJharkhand.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#2b8c54',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#2b8c54',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#28a745',
                  }
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: 'rgba(43, 140, 84, 0.1)',
                }
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData
            ? "Add New Explore Jharkhand"
            : viewShow
            ? "View Explore Jharkhand Details"
            : editShow
            ? "Edit Explore Jharkhand"
            : deleteShow
            ? "Delete Explore Jharkhand"
            : ""
        }
        dialogContent={
          openData ? (
            <Create formData={formData} handleInputChange={handleFormChange} errors={formErrors} />
          ) : viewShow ? (
            <View selectedData={selectedData} />
          ) : editShow ? (
            <Edit formData={formData} handleInputChange={handleFormChange} errors={formErrors} selectedData={selectedData} />
          ) : deleteShow ? (
            <Delete selectedData={selectedData} />
          ) : null
        }
        primaryAction={openData || editShow || deleteShow}
        primaryActionText={openData ? "Create" : editShow ? "Update" : "Delete"}
        primaryActionColor={deleteShow ? "error" : "primary"}
        onPrimaryAction={openData ? handleCreate : editShow ? handleUpdate : handleDeleteConfirm}
        secondaryActionText={viewShow ? "Close" : "Cancel"}
        showActions={!viewShow}
        maxWidth={deleteShow ? "xs" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default ExploreJharkhand;