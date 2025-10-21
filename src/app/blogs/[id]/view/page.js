'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const BlogView = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    setIsClient(true);
    fetchBlogDetail();
  }, [params.id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    return null;
  }

  return (
    <div className="content-area">
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          View Blog Detail - ID: {blogData._id}
        </Typography>
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
          {blogData.blogDetailBanner && (
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
                src={blogData.blogDetailBanner} 
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

        {/* Blog Description */}
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
            Description
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#475569', 
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
          >
            {blogData.blogDetailDescription}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

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
            dangerouslySetInnerHTML={{ __html: blogData.editorContent || '<p>No content available</p>' }}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default BlogView;

