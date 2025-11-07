'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Skeleton
} from '@mui/material';
import TipTapEditor from '@/components/TipTapEditor';

const BlogDetailEdit = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [formData, setFormData] = useState({
    blogBanner1: '',
    editorContent: '',
    date: '',
    category: '',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    setIsClient(true);
    fetchBlogDetail();
  }, [params.detailId]);

  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/${params.detailId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog detail');
      const data = await response.json();
      setBlogData(data.data);
      
      // Format date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        blogBanner1: data.data.blogDetailBanner || '',
        editorContent: data.data.blogDetailDescription || '',
        date: formatDate(data.data.date) || '',
        category: data.data.category || '',
        tags: data.data.tags ? data.data.tags.join(', ') : ''
      });
    } catch (err) {
      console.error('Error fetching blog detail:', err);
      setBlogData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, bannerNumber) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setFormData(prev => ({
          ...prev,
          [`blogBanner${bannerNumber}`]: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      editorContent: content
    }));
    // Clear error when user starts typing
    if (formErrors.editorContent) {
      setFormErrors(prev => ({
        ...prev,
        editorContent: ''
      }));
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.editorContent?.trim()) {
      errors.editorContent = 'Blog content is required';
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
      return;
    }
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      if (formData.blogBanner1) formDataToSend.append('blogDetailBanner', formData.blogBanner1);
      formDataToSend.append('blogDetailDescription', formData.editorContent);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/${params.detailId}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update blog detail');
      
      setSnackbarMessage('Blog detail updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setTimeout(() => {
        router.push(`/blogs/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating blog detail:', err);
      setSnackbarMessage('Failed to update blog detail');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        {/* Header Skeleton */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="text" width={200} height={40} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
          </Box>
        </Box>

        {/* Blog Banner Skeleton */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
          <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Paper>

        {/* Date and Category Skeleton */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Date Field Skeleton */}
            <Box>
              <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Category Field Skeleton */}
            <Box>
              <Skeleton variant="text" width="25%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>

          {/* Tags Field Skeleton */}
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="text" width="15%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Box>
        </Paper>

        {/* Blog Content Editor Skeleton */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
          <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
        </Paper>
      </div>
    );
  }

  if (!blogData) {
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
          <Alert severity="error">Blog detail not found</Alert>
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Edit Blog Detail
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push(`/blogs/${params.id}`)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>

        {/* Blog Banner */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Blog Banner
          </Typography>
          
          {formData.blogBanner1 ? (
            <Box sx={{ mb: 2 }}>
              <img 
                src={formData.blogBanner1} 
                alt="Current Banner" 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
          ) : null}
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
            style={{ display: 'none' }}
            id="banner-upload"
          />
          <label htmlFor="banner-upload">
            <Button
              variant="outlined"
              component="span"
              sx={{ 
                textTransform: 'none',
                borderColor: '#2b8c54',
                color: '#2b8c54',
                '&:hover': {
                  borderColor: '#28a745',
                  backgroundColor: 'rgba(43, 140, 84, 0.04)'
                }
              }}
            >
              {formData.blogBanner1 ? 'Change Banner Image' : 'Upload Banner Image'}
            </Button>
          </label>
        </Paper>

        {/* Date and Category Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Date and Category
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Date Field */}
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
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
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
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
              variant="body2" 
              sx={{ 
                mb: 1, 
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

        {/* Blog Content Editor */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Blog Content
          </Typography>
          <TipTapEditor
            content={formData.editorContent}
            onChange={handleEditorChange}
          />
          {formErrors.editorContent && (
            <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
              {formErrors.editorContent}
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogDetailEdit;
