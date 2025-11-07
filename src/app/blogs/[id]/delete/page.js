'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, Delete } from "@mui/icons-material";

const BlogDelete = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchBlogDetail();
  }, [params.id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog detail');
      const data = await response.json();
      setBlogData(data.data);
    } catch (err) {
      console.error('Error fetching blog detail:', err);
      setBlogData(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blogData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete blog');
      
      router.push('/blogs');
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setIsDeleting(false);
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

  if (!blogData) {
    return (
      <div className="content-area">
        <Typography variant="h6" sx={{ color: '#666', textAlign: 'center', mt: 4 }}>
          Blog not found
        </Typography>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Delete Blog ID: {blogData._id}
          </Typography>
        </Box>
      </Box>

      {/* Delete Confirmation */}
      <Paper sx={{ p: 4, maxWidth: '600px', mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img 
            src={blogData.blogBanner} 
            alt="Blog Banner" 
            style={{ 
              width: '200px', 
              height: '150px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px'
            }} 
          />
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this blog?
          </Typography>
        
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Blog Details:
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>ID:</strong> {blogData._id}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Description:</strong> {blogData.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isDeleting}
            sx={{ minWidth: '120px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{ minWidth: '120px' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Blog'}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default BlogDelete;
