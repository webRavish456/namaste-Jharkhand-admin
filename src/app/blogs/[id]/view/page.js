'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
  TextField,
  Skeleton
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const BlogView = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    setIsClient(true);
    fetchBlogDetail();
  }, [params.id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/blog/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog detail');
      const data = await response.json();
      console.log('Fetched blog data:', data.data);
      console.log('Date field:', data.data && data.data.length > 0 ? data.data[0].date : 'No date');
      setBlogData(data.data);
    } catch (err) {
      console.error('Error fetching blog detail:', err);
      setBlogData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        {/* Header Skeleton */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            mb: 3,
            pb: 2,
            borderBottom: '2px solid #e0e0e0'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box>
            <Skeleton variant="text" width={200} height={40} />
          </Box>
        </Box>

        {/* Blog Content Skeleton */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            border: '1px solid #e5e7eb',
            borderRadius: '12px'
          }}
        >
          {/* Blog Banner Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Box>

          <Skeleton variant="rectangular" height={2} sx={{ mb: 4 }} />

          {/* Date and Category Skeleton */}
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
          </Box>

          {/* Blog Content Skeleton */}
          <Box>
            <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
          </Box>
        </Paper>
      </div>
    );
  }

  if (!blogData) {
    return null;
  }

  return (
    <div className="content-area">
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          mb: 3,
          pb: 2,
          borderBottom: '2px solid #e0e0e0'
        }}
      >
        <IconButton 
          onClick={() => router.back()}
          sx={{ 
            mr: 2,
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
            View Blog Detail
          </Typography>
        </Box>
      </Box>

      {/* Blog Content */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}
      >
        {/* Blog Banner */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2, 
              color: '#1e293b',
              fontSize: '1.25rem'
            }}
          >
            Blog Banner
          </Typography>
          {blogData && blogData.length > 0 && blogData[0].blogDetailBanner && (
            <Box
              sx={{
                width: '100%',
                height: '400px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={blogData[0].blogDetailBanner} 
                alt="Blog Banner" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

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
                  value={blogData && blogData.length > 0 ? (blogData[0].date ? new Date(blogData[0].date).toISOString().split('T')[0] : '') : ''}
                  disabled
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
                  value={blogData && blogData.length > 0 ? blogData[0].category || '' : ''}
                  disabled
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
                value={blogData && blogData.length > 0 ? (blogData[0].tags ? blogData[0].tags.join(', ') : '') : ''}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Blog Content */}
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 2, 
              color: '#1e293b',
              fontSize: '1.25rem'
            }}
          >
            Blog Content
          </Typography>
          <Box 
            sx={{ 
              '& h2': {
                fontSize: '1.875rem',
                fontWeight: 700,
                marginTop: '1.5rem',
                marginBottom: '0.75rem',
                lineHeight: 1.3,
                color: '#1e293b',
              },
              '& h3': {
                fontSize: '1.5rem',
                fontWeight: 600,
                marginTop: '1.25rem',
                marginBottom: '0.625rem',
                lineHeight: 1.4,
                color: '#334155',
              },
              '& p': {
                lineHeight: 1.8,
                marginBottom: '1rem',
                color: '#475569',
                fontSize: '1.1rem'
              },
              '& ul, & ol': {
                paddingLeft: '1.5rem',
                marginBottom: '1rem',
              },
              '& li': {
                marginBottom: '0.5rem',
                color: '#475569',
                lineHeight: 1.8
              },
              '& img': {
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                margin: '1rem 0',
                display: 'block',
              },
              '& a': {
                color: '#2563eb',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  color: '#1d4ed8',
                },
              },
              '& iframe': {
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '8px',
                margin: '1rem 0',
                border: 'none',
                display: 'block',
              }
            }}
            dangerouslySetInnerHTML={{ __html: (blogData && blogData.length > 0 ? blogData[0].blogDetailDescription : '') || '<p>No content available</p>' }}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default BlogView;

