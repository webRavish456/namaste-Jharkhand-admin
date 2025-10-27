'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import TipTapEditor from '@/components/TipTapEditor';

const BlogCreate = () => {
  const router = useRouter();
  const params = useParams();
  const [isClient, setIsClient] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    blogDetailBanner: null,
    blogDetailDescription: '',
    date: '',
    category: '',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleEditorChange = (html) => {
    setFormData(prev => ({
      ...prev,
      blogDetailDescription: html
    }));
    // Clear error when user starts typing
    if (formErrors.blogDetailDescription) {
      setFormErrors(prev => ({
        ...prev,
        blogDetailDescription: ''
      }));
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        blogDetailBanner: file
      }));
      // Clear image error when user selects an image
      if (formErrors.blogDetailBanner) {
        setFormErrors(prev => ({
          ...prev,
          blogDetailBanner: ''
        }));
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.blogDetailBanner) {
      errors.blogDetailBanner = 'Blog banner is required';
    }
    
    if (!formData.blogDetailDescription?.trim()) {
      errors.blogDetailDescription = 'Blog content is required';
    }
    
    if (!formData.date?.trim()) {
      errors.date = 'Date is required';
    }
    
    if (!formData.category?.trim()) {
      errors.category = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSave = async () => {
    if (!validateForm()) {
      setIsCreating(false);
      return;
    }
    
    setIsCreating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('blogId', params.id);
      formDataToSend.append('blogDetailBanner', formData.blogDetailBanner);
      formDataToSend.append('blogDetailDescription', formData.blogDetailDescription);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('status', 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        showSnackbar('Blog detail created successfully!', 'success');
        setTimeout(() => {
          router.push(`/blogs/${params.id}`);
        }, 1500);
      } else {
        showSnackbar(data.message || 'Failed to create blog detail', 'error');
      }
    } catch (error) {
      console.error('Error creating blog detail:', error);
      showSnackbar('Failed to create blog detail', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    router.push(`/blogs/${params.id}`);
  };

  if (!isClient) {
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

  return (
    <div className="content-area">
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '2px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Create New Blog
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isCreating}
            sx={{ 
              height: '42px',
              px: 3,
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              borderWidth: '2px',
              '&:hover': { borderWidth: '2px' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handleSave}
            disabled={isCreating}
            sx={{ 
              height: '42px',
              px: 3,
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: '#2b8c54',
              boxShadow: 2,
              '&:hover': { 
                backgroundColor: '#28a745',
                boxShadow: 4 
              }
            }}
          >
            {isCreating ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>

      {/* Blog Banner */}
      <Box sx={{ mb: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Blog Banner <Typography component="span" color="error">*</Typography>
          </Typography>
          
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
            sx={{ 
              height: '120px',
              border: '2px dashed #cbd5e1',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              color: '#64748b',
              backgroundColor: '#f8fafc',
              '&:hover': {
                border: '2px dashed #2b8c54',
                backgroundColor: 'rgba(43, 140, 84, 0.04)',
                color: '#2b8c54'
              }
            }}
          >
            {formData.blogDetailBanner ? 'Change Banner Image' : 'Upload Banner Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          
          {formData.blogDetailBanner && (
            <Box sx={{ mt: 2 }}>
              <img
                src={URL.createObjectURL(formData.blogDetailBanner)}
                alt="Banner Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </Box>
          )}
          {formErrors.blogDetailBanner && (
            <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
              {formErrors.blogDetailBanner}
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Date and Category Section */}
      <Box sx={{ mb: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Date Field */}
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Date <Typography component="span" color="error">*</Typography>
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, date: e.target.value }));
                  if (formErrors.date) {
                    setFormErrors(prev => ({ ...prev, date: '' }));
                  }
                }}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.date}
                helperText={formErrors.date}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Box>

            {/* Category Field */}
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Category <Typography component="span" color="error">*</Typography>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter category (e.g., Travel, Food, Adventure)"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                  if (formErrors.category) {
                    setFormErrors(prev => ({ ...prev, category: '' }));
                  }
                }}
                error={!!formErrors.category}
                helperText={formErrors.category}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Tags Field */}
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 2,
                fontWeight: 600,
                color: '#1e293b'
              }}
            >
              Tags
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter tags separated by commas (e.g., jharkhand, tourism, adventure)"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
          </Box>
        </Paper>
      </Box>

      {/* TipTap Editor Section */}
      <Box>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Blog Content <Typography component="span" color="error">*</Typography>
        </Typography>

        <TipTapEditor
          content={formData.blogDetailDescription}
          onChange={handleEditorChange}
          placeholder="Start writing your blog content..."
        />
        {formErrors.blogDetailDescription && (
          <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
            {formErrors.blogDetailDescription}
          </Typography>
        )}
      </Box>


      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogCreate;
