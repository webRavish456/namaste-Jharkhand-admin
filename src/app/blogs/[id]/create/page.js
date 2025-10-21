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
    blogDetailDescription: ''
  });

  const handleEditorChange = (html) => {
    setFormData(prev => ({
      ...prev,
      blogDetailDescription: html
    }));
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
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  const handleSave = async () => {
    setIsCreating(true);
    
    // Validate form
    if (!formData.blogDetailBanner || !formData.blogDetailDescription) {
      showSnackbar('Please fill in all required fields', 'error');
      setIsCreating(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('blogId', params.id);
      formDataToSend.append('blogDetailBanner', formData.blogDetailBanner);
      formDataToSend.append('blogDetailDescription', formData.blogDetailDescription);
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
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
              boxShadow: 2,
              '&:hover': { boxShadow: 4 }
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
                border: '2px dashed #1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                color: '#1976d2'
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
          value={formData.blogDetailDescription}
          onChange={handleEditorChange}
          placeholder="Start writing your blog content..."
        />
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
