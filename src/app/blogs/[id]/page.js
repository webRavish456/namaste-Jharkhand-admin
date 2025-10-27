'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Pagination,
  Stack
} from "@mui/material";
import { ArrowBack, VisibilityOutlined, DeleteOutlined, Search, Add, Edit } from "@mui/icons-material";

const BlogDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);
  const [blogDetails, setBlogDetails] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    setIsClient(true);
    
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to access this page.');
      window.location.href = '/login';
      return;
    }
    
    fetchBlogDetail();
    fetchBlogDetails();
  }, [params.id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/blog/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch blog details');
      const data = await response.json();
      setBlogDetails(data.data || []);
    } catch (err) {
      console.error('Error fetching blog details:', err);
      setBlogDetails([]);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        // Redirect to login page
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blog-details/${itemToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = await response.json();
      console.log('Delete response:', responseData);
      
      if (!response.ok) {
        if (response.status === 401) {
          alert('Session expired. Please login again.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else {
          alert(responseData.message || 'Failed to delete blog detail');
        }
        return;
      }
      
      alert('Blog detail deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      // Refresh the blog details list
      fetchBlogDetails();
    } catch (err) {
      console.error('Error deleting blog detail:', err);
      alert('Failed to delete blog detail. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={300} height={40} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
          </Box>
        </Box>

        {/* Search and Create Button Skeleton */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={180} height={40} />
        </Box>

        {/* Table Skeleton */}
        <Box className="hrms-card">
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>S. No.</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog Detail Banner</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog Detail Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    <TableCell><Skeleton variant="text" width={30} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={40} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
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
        </Box>
      </div>
    );
  }



  return (
    <div className="content-area">
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3
      }}>
        <Box sx={{ flex: 1 }}></Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search blogs..."
            variant="outlined"
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#bdbdbd',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2b8c54',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push(`/blogs/${params.id}/create`)}
            sx={{
              backgroundColor: '#2b8c54',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.875rem',
              padding: '10px 20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textTransform:'none',
              '&:hover': {
                backgroundColor: '#28a745',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }
            }}
          >
            Create Detail Blog
          </Button>
        </Box>
      </Box>

      {/* Create Blog Details Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>S. No.</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog ID</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog Detail Banner</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Blog Detail Description</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8f9fa' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogDetails.length > 0 ? (
                blogDetails
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((detail, index) => (
                  <TableRow key={detail._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {detail._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {detail.blogDetailBanner ? (
                          <img 
                            src={detail.blogDetailBanner} 
                            alt="Blog Detail Banner" 
                            style={{ 
                              width: '60px', 
                              height: '40px', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              border: '1px solid #e0e0e0'
                            }} 
                          />
                        ) : (
                          <Box sx={{ 
                            width: '60px', 
                            height: '40px', 
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                        {detail.blogDetailDescription && detail.blogDetailDescription.length > 50 
                          ? `${detail.blogDetailDescription.substring(0, 50)}...` 
                          : detail.blogDetailDescription || 'No description'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: detail.status === 'active' ? "#2e7d32" : "#d32f2f"
                        }}
                      >
                        {detail.status || 'Active'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => router.push(`/blogs/${params.id}/view`)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => router.push(`/blogs/${params.id}/edit/${detail._id}`)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteClick(detail)}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No blog details found. Create your first blog detail!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination Footer */}
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
             Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, blogDetails.length)} of {blogDetails.length} items
            </Typography>
            <Pagination
              count={Math.ceil(blogDetails.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#2b8c54',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#2b8c54',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#28a745',
                  }
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: 'rgba(43, 140, 84, 0.1)',
                }
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.25rem',
          fontWeight: 600,
          pb: 2,
          px: 2
        }}>
          Delete Blog Detail
        </DialogTitle>
        
        <DialogContent sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" sx={{ color: '#333' }}>
            Are you sure you want to delete this blog detail? 
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pt: 2, pb: 1, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#666',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#333'
              }
            }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 600,
              bgcolor: '#d32f2f',
              '&:hover': {
                bgcolor: '#c62828'
              }
            }}
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlogDetail;
