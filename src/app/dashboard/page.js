'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Chip,
  LinearProgress
} from "@mui/material";
import { 
  ArticleOutlined, 
  ExploreOutlined, 
  ContactMailOutlined,
  TrendingUpOutlined,
  Add,
  Visibility,
  Analytics,
  ArrowForward
} from "@mui/icons-material";

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    blogs: 0,
    exploreJharkhand: 0,
    enquiries: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(loading)
    {
        setIsClient(true);
        fetchDashboardStats();
    }
  }, [loading]);

  // API Functions
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [blogsRes, exploreRes, enquiriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/enquiries`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const [blogsData, exploreData, enquiriesData] = await Promise.all([
        blogsRes.json(),
        exploreRes.json(),
        enquiriesRes.json()
      ]);

      setStats({
        blogs: blogsData.data?.length || 0,
        exploreJharkhand: exploreData.data?.length || 0,
        enquiries: enquiriesData.data?.length || 0,
        totalViews: (blogsData.data?.length || 0) + (exploreData.data?.length || 0) * 2
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
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
            Loading Dashboard...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
          </Alert>
          <Button onClick={fetchDashboardStats} variant="contained">
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Blogs',
      value: stats.blogs,
      icon: <ArticleOutlined />,
      color: '#1976d2',
      bgColor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Explore Jharkhand',
      value: stats.exploreJharkhand,
      icon: <ExploreOutlined />,
      color: '#2e7d32',
      bgColor: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Enquiries',
      value: stats.enquiries,
      icon: <ContactMailOutlined />,
      color: '#ed6c02',
      bgColor: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: <TrendingUpOutlined />,
      color: '#9c27b0',
      bgColor: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Blogs',
      description: 'Create, edit, and manage blog posts',
      icon: <ArticleOutlined />,
      color: '#1976d2',
      path: '/blogs',
      action: 'Create New Blog'
    },
    {
      title: 'Explore Jharkhand',
      description: 'Manage tourist destinations and places',
      icon: <ExploreOutlined />,
      color: '#2e7d32',
      path: '/explore-jharkhand',
      action: 'Add New Place'
    },
    {
      title: 'View Enquiries',
      description: 'Check and respond to customer enquiries',
      icon: <ContactMailOutlined />,
      color: '#ed6c02',
      path: '/enquiry',
      action: 'View All Enquiries'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: <Analytics />,
      color: '#9c27b0',
      path: '/analytics',
      action: 'View Reports'
    }
  ];

  return (
    <div className="content-area">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1a1a1a',
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              fontSize: '1.1rem'
            }}
          >
            Welcome back! Here&apos;s what&apos;s happening with your content.
          </Typography>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid size={12} xs={12} sm={6} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: card.bgColor,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(card.icon, { sx: { fontSize: 28 } })}
                    </Box>
                    <Chip 
                      label={card.change} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.9,
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                  >
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#1a1a1a',
              mb: 3,
              fontSize: { xs: '1.5rem', sm: '1.75rem' }
            }}
          >
            Quick Actions
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {quickActions.map((action, index) => (
              <Grid size={12} xs={12} sm={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      borderColor: action.color,
                    }
                  }}
                  onClick={() => router.push(action.path)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: `${action.color}15`,
                          color: action.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        {React.cloneElement(action.icon, { sx: { fontSize: 24 } })}
                      </Box>
                      <ArrowForward sx={{ color: '#999', fontSize: 20, ml: 'auto' }} />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        mb: 1
                      }}
                    >
                      {action.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {action.description}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: action.color,
                        borderColor: action.color,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: `${action.color}10`,
                          borderColor: action.color,
                        }
                      }}
                    >
                      {action.action}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activity Section */}
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#fafafa'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#1a1a1a',
              mb: 2
            }}
          >
            Recent Activity
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress 
              sx={{ 
                flexGrow: 1, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                }
              }} 
              variant="determinate" 
              value={75} 
            />
            <Typography variant="body2" color="text.secondary">
              75% Complete
            </Typography>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Dashboard;
