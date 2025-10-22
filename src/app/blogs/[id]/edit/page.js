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
  TextField,
} from "@mui/material";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import TipTapEditor from '@/components/TipTapEditor';

const BlogEdit = () => {
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

  useEffect(() => {
    setIsClient(true);
    fetchBlogDetail();
  }, [params.id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/blog/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog detail');
      const data = await response.json();
      console.log('Edit page - Fetched blog data:', data.data);
      console.log('Edit page - Date field:', data.data && data.data.length > 0 ? data.data[0].date : 'No date');
      setBlogData(data.data);
      if (data.data && data.data.length > 0) {
        // Format date for HTML date input (YYYY-MM-DD)
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        setFormData({
          blogBanner1: data.data[0].blogDetailBanner || '',
          editorContent: data.data[0].blogDetailDescription || '',
          date: formatDate(data.data[0].date) || '',
          category: data.data[0].category || '',
          tags: data.data[0].tags ? data.data[0].tags.join(', ') : ''
        });
      }
    } catch (err) {
      console.error('Error fetching blog detail:', err);
      setBlogData(null);
    }
  };

  const handleImageUpload = (e, bannerNumber) => {
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
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      if (formData.blogBanner1) formDataToSend.append('blogDetailBanner', formData.blogBanner1);
      formDataToSend.append('editorContent', formData.editorContent);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update blog');
      
      router.push(`/blogs/${params.id}`);
    } catch (err) {
      console.error('Error updating blog:', err);
      alert('Failed to update blog. Please try again.');
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
            Edit Blog
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
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
            onClick={handleSave}
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
            Save Changes
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
            Blog Banner
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
            {formData.blogBanner1 ? 'Change Banner Image' : 'Upload Banner Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 1)}
            />
          </Button>
          
          {formData.blogBanner1 && (
            <Box sx={{ mt: 2 }}>
              <img
                src={formData.blogBanner1}
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
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
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
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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

      {/* Editor Section */}
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
            color: '#1e293b'
          }}
        >
          Blog Content
        </Typography>
        
        <TipTapEditor 
          value={formData.editorContent}
          onChange={handleEditorChange}
          placeholder="Enter your blog content..."
        />
      </Paper>
    </div>
  );
};

export default BlogEdit;
