'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { 
  ArticleOutlined, 
  ExploreOutlined, 
  ContactMailOutlined,
  TrendingUpOutlined,
  Analytics,
  ArrowForward
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const router = useRouter();
  const [enquiryData, setEnquiryData] = useState([]);
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    blogs: { total: 0, change: '+0%', changeType: 'positive' },
    exploreJharkhand: { total: 0, change: '+0%', changeType: 'positive' },
    enquiries: { total: 0, change: '+0%', changeType: 'positive' }
  });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch all stats in parallel
        const [blogsResponse, exploreResponse, enquiriesResponse] = await Promise.all([
          fetch('/blogs/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/explore-jharkhand/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/dashboard/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const [blogsData, exploreData, enquiriesData] = await Promise.all([
          blogsResponse.ok ? blogsResponse.json() : { data: { totalBlogs: 0, blogChange: '+0%', changeType: 'positive' } },
          exploreResponse.ok ? exploreResponse.json() : { data: { totalPlaces: 0, placeChange: '+0%', changeType: 'positive' } },
          enquiriesResponse.ok ? enquiriesResponse.json() : { data: { totalEnquiries: 0, enquiryChange: '+0%', changeType: 'positive' } }
        ]);

        setStatsData({
          blogs: {
            total: blogsData.data?.totalBlogs || 0,
            change: blogsData.data?.blogChange || '+0%',
            changeType: blogsData.data?.changeType || 'positive'
          },
          exploreJharkhand: {
            total: exploreData.data?.totalPlaces || 0,
            change: exploreData.data?.placeChange || '+0%',
            changeType: exploreData.data?.changeType || 'positive'
          },
          enquiries: {
            total: enquiriesData.data?.totalEnquiries || 0,
            change: enquiriesData.data?.enquiryChange || '+0%',
            changeType: enquiriesData.data?.changeType || 'positive'
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch enquiry analytics data
  useEffect(() => {
    const fetchEnquiryAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/enquiries/analytics?days=${selectedDays}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setEnquiryData(result.data || []);
        } else {
          console.error('Failed to fetch enquiry analytics');
          setEnquiryData([]);
        }
      } catch (error) {
        console.error('Error fetching enquiry analytics:', error);
        setEnquiryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryAnalytics();
  }, [selectedDays]);

  const statCards = [
    {
      title: 'Total Blogs',
      value: statsData.blogs.total,
      icon: <ArticleOutlined />,
      color: '#1976d2',
      bgColor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      change: statsData.blogs.change,
      changeType: statsData.blogs.changeType
    },
    {
      title: 'Explore Jharkhand',
      value: statsData.exploreJharkhand.total,
      icon: <ExploreOutlined />,
      color: '#2e7d32',
      bgColor: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
      change: statsData.exploreJharkhand.change,
      changeType: statsData.exploreJharkhand.changeType
    },
    {
      title: 'Total Enquiries',
      value: statsData.enquiries.total,
      icon: <ContactMailOutlined />,
      color: '#ed6c02',
      bgColor: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
      change: statsData.enquiries.change,
      changeType: statsData.enquiries.changeType
    },
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
  ];

  return (
    <div className="content-area">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
     
        
        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid size={{xs: 12, sm: 6, md: 4, lg: 4}} key={index}>
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

        {/* Enquiry Analytics Chart */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#1a1a1a',
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Enquiry Analytics
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={selectedDays}
                label="Time Period"
                onChange={(e) => setSelectedDays(e.target.value)}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ height: 400 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">Loading chart data...</Typography>
                </Box>
              ) : enquiryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enquiryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        });
                      }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#ed6c02" 
                      strokeWidth={3}
                      dot={{ fill: '#ed6c02', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ed6c02', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">No enquiry data available for the selected period</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>

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
              <Grid size={{xs: 12, sm: 6, md: 4, lg: 4}} key={index}>
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

      </Box>
    </div>
  );
};

export default Dashboard;
