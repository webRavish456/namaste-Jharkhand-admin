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
import CommonDialog from '@/components/CommonDialog';
import ViewTestimonial from '@/components/testimonials/view';
import CreateTestimonial from '@/components/testimonials/create';
import EditTestimonial from '@/components/testimonials/edit';
import DeleteTestimonial from '@/components/testimonials/delete';

const Testimonials = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [selectedData, setSelectedData] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(loading)
    {
        setIsClient(true);
        fetchTestimonials();
    }
  }, [loading]);

  // API Functions
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/testimonials`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonialsData(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', testimonialData.image);
      formDataToSend.append('title', testimonialData.title);
      formDataToSend.append('date', testimonialData.date);
      formDataToSend.append('authorName', testimonialData.authorName);
      formDataToSend.append('description', testimonialData.description);
      // Status will be set to 'active' by default in backend

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/testimonials`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to create testimonial');
      await fetchTestimonials(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error creating testimonial:', err);
      return false;
    }
  };

  const updateTestimonial = async (id, testimonialData) => {
    try {
      const formDataToSend = new FormData();
      if (testimonialData.image && testimonialData.image instanceof File) {
        formDataToSend.append('image', testimonialData.image);
      }
      formDataToSend.append('title', testimonialData.title);
      formDataToSend.append('date', testimonialData.date);
      formDataToSend.append('authorName', testimonialData.authorName);
      formDataToSend.append('description', testimonialData.description);
      formDataToSend.append('status', testimonialData.status || 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/testimonials/${id}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update testimonial');
      await fetchTestimonials(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error updating testimonial:', err);
      return false;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');
      await fetchTestimonials(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      return false;
    }
  };

  // Dialog states

  const filteredTestimonials = testimonialsData.filter(testimonial =>
    testimonial.description?.toLowerCase().includes(search.toLowerCase()) ||
    testimonial.title?.toLowerCase().includes(search.toLowerCase()) ||
    testimonial.authorName?.toLowerCase().includes(search.toLowerCase())
  );

  // Dialog handlers
  const handleView = (item) => {
    setSelectedData(item);
    setOpenViewDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    // Format date for HTML date input (YYYY-MM-DD)
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      image: item.image,
      title: item.title || '',
      date: formatDate(item.date) || '',
      authorName: item.authorName || '',
      description: item.description || '',
      status: item.status || 'active'
    });
    setOpenEditDialog(true);
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setOpenDeleteDialog(true);
  };

  const handleCreate = () => {
    setFormData({
      image: '',
      title: '',
      date: '',
      authorName: '',
      description: ''
    });
    setOpenCreateDialog(true);
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.date?.trim()) {
      errors.date = 'Date is required';
    }
    
    if (!formData.authorName?.trim()) {
      errors.authorName = 'Author name is required';
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    // For create mode, image is required
    // For edit mode, check if there's existing image or new image selected
    if (openCreateDialog && !formData.image) {
      errors.image = 'Testimonial image is required';
    } else if (openEditDialog && !formData.image && !selectedData?.image) {
      errors.image = 'Testimonial image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form input change handler
  const handleInputChange = (e) => {
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

  // Save handlers
  const handleSaveCreate = async () => {
    if (!validateForm()) {
      return;
    }
    
    const success = await createTestimonial(formData);
    if (success) {
      setOpenCreateDialog(false);
      setFormData({});
      setFormErrors({});
      alert('Testimonial created successfully!');
    } else {
      alert('Failed to create testimonial. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) {
      return;
    }
    
    const success = await updateTestimonial(selectedData._id, formData);
    if (success) {
      setOpenEditDialog(false);
      setFormData({});
      setFormErrors({});
      setSelectedData(null);
      alert('Testimonial updated successfully!');
    } else {
      alert('Failed to update testimonial. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    const success = await deleteTestimonial(selectedData._id);
    if (success) {
      setOpenDeleteDialog(false);
      setSelectedData(null);
      alert('Testimonial deleted successfully!');
    } else {
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  // Close handlers
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedData(null);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setFormData({});
    setFormErrors({});
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setFormData({});
    setFormErrors({});
    setSelectedData(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedData(null);
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        {/* Search and Create Button Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        {/* Table Skeleton */}
        <Box className="hrms-card">
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Author Name</TableCell>
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
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
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
          <Button onClick={fetchTestimonials} variant="contained">
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  const paginatedTestimonials = filteredTestimonials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="content-area">
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search testimonials..."
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
          onClick={handleCreate}
          sx={{ 
            height: "40px",
            textTransform: 'none',
            backgroundColor: '#2b8c54',
            '&:hover': {
              backgroundColor: '#28a745'
            }
          }}
        >
          Create Testimonial
        </Button>
      </Box>

      {/* Testimonials Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Author Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      No testimonials found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTestimonials.map((testimonial, index) => (
                  <TableRow key={testimonial._id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.title}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {testimonial.title || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {testimonial.date ? new Date(testimonial.date).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {testimonial.authorName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: testimonial.status === 'active' ? '#e8f5e9' : '#ffebee',
                          color: testimonial.status === 'active' ? '#2e7d32' : '#c62828',
                          fontWeight: 500
                        }}
                      >
                        {testimonial.status || 'active'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(testimonial);
                          }}
                          sx={{ color: '#1976d2' }}
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(testimonial);
                          }}
                          sx={{ color: '#ff9800' }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(testimonial);
                          }}
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination */}
        {filteredTestimonials.length > 0 && (
          <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredTestimonials.length)} of {filteredTestimonials.length} testimonials
              </Typography>
              <Pagination
                count={Math.ceil(filteredTestimonials.length / rowsPerPage)}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                color="primary"
                size="small"
              />
            </Stack>
          </Box>
        )}
      </Box>

      {/* View Dialog */}
      <CommonDialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        dialogTitle="View Testimonial"
        dialogContent={<ViewTestimonial selectedData={selectedData} />}
        maxWidth="md"
      />

      {/* Create Dialog */}
      <CommonDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        dialogTitle="Create New Testimonial"
        dialogContent={
          <CreateTestimonial 
            formData={formData} 
            handleInputChange={handleInputChange}
            errors={formErrors}
            setFormErrors={setFormErrors}
          />
        }
        primaryAction={true}
        primaryActionText="Create"
        onPrimaryAction={handleSaveCreate}
        maxWidth="md"
      />

      {/* Edit Dialog */}
      <CommonDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        dialogTitle="Edit Testimonial"
        dialogContent={
          <EditTestimonial 
            formData={formData} 
            handleInputChange={handleInputChange}
            errors={formErrors}
            setFormErrors={setFormErrors}
          />
        }
        primaryAction={true}
        primaryActionText="Save Changes"
        onPrimaryAction={handleSaveEdit}
        maxWidth="md"
      />

      {/* Delete Dialog */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        dialogTitle="Delete Testimonial"
        dialogContent={<DeleteTestimonial selectedData={selectedData} />}
        primaryAction={true}
        primaryActionText="Delete"
        primaryActionColor="error"
        onPrimaryAction={handleConfirmDelete}
        maxWidth="sm"
      />

    </div>
  );
};

export default Testimonials;

