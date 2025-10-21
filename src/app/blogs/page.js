'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '@/components/CommonDialog';
import ViewBlog from '@/components/blogs/view';
import CreateBlog from '@/components/blogs/create';
import EditBlog from '@/components/blogs/edit';
import DeleteBlog from '@/components/blogs/delete';

const Blogs = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [selectedData, setSelectedData] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({});

  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(loading)
    {
        setIsClient(true);
        fetchBlogs();
    }
  }, [loading]);

  // API Functions
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogsData(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append('blogImage', blogData.blogImage);
      formData.append('blogHeading', blogData.blogHeading);
      formData.append('blogTitle', blogData.blogTitle);
      formData.append('blogDate', blogData.blogDate);
      formData.append('blogCreatedBy', blogData.blogCreatedBy);
      formData.append('blogDescription', blogData.blogDescription);
      formData.append('status', blogData.status || 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to create blog');
      await fetchBlogs(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error creating blog:', err);
      return false;
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const formData = new FormData();
      if (blogData.blogImage) formData.append('blogImage', blogData.blogImage);
      formData.append('blogHeading', blogData.blogHeading);
      formData.append('blogTitle', blogData.blogTitle);
      formData.append('blogDate', blogData.blogDate);
      formData.append('blogCreatedBy', blogData.blogCreatedBy);
      formData.append('blogDescription', blogData.blogDescription);
      formData.append('status', blogData.status || 'active');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update blog');
      await fetchBlogs(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error updating blog:', err);
      return false;
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete blog');
      await fetchBlogs(); // Refresh list
      return true;
    } catch (err) {
      console.error('Error deleting blog:', err);
      return false;
    }
  };

  // Dialog states


  const filteredBlogs = blogsData.filter(blog =>
    blog.blogDescription.toLowerCase().includes(search.toLowerCase()) ||
    blog.blogTitle.toLowerCase().includes(search.toLowerCase()) ||
    blog.blogHeading.toLowerCase().includes(search.toLowerCase())
  );

  // Dialog handlers
  const handleView = (item) => {
    setSelectedData(item);
    setOpenViewDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    setFormData(item);
    setOpenEditDialog(true);
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setOpenDeleteDialog(true);
  };

  const handleCreate = () => {
    setFormData({
      blogImage: '',
      blogHeading: '',
      blogTitle: '',
      blogDate: '',
      blogCreatedBy: 'Admin',
      blogDescription: ''
    });
    setOpenCreateDialog(true);
  };

  const handleRowClick = (item) => {
    router.push(`/blogs/${item._id}`);
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save handlers
  const handleSaveCreate = async () => {
    const success = await createBlog(formData);
    if (success) {
      setOpenCreateDialog(false);
      setFormData({});
      alert('Blog created successfully!');
    } else {
      alert('Failed to create blog. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    const success = await updateBlog(selectedData._id, formData);
    if (success) {
      setOpenEditDialog(false);
      setFormData({});
      setSelectedData(null);
      alert('Blog updated successfully!');
    } else {
      alert('Failed to update blog. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    const success = await deleteBlog(selectedData._id);
    if (success) {
      setOpenDeleteDialog(false);
      setSelectedData(null);
      alert('Blog deleted successfully!');
    } else {
      alert('Failed to delete blog. Please try again.');
    }
  };

  // Close handlers
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedData(null);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setFormData({});
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setFormData({});
    setSelectedData(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedData(null);
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
            Loading...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
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
          <Typography variant="h6" sx={{ color: 'error.main' }}>
            Error: {error}
          </Typography>
          <Button onClick={fetchBlogs} variant="contained">
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ height: "40px" }}
        >
          Create Blog
        </Button>
      </Box>

      {/* Blogs Table - Read Only */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Blog Image</TableCell>
                <TableCell>Blog Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((blog, index) => (
                  <TableRow 
                    key={blog._id || `blog-${index}`}
                    onClick={() => handleRowClick(blog)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {blog._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <img src={blog.blogImage} alt="Blog" width={60} height={40} style={{borderRadius: '4px', objectFit: 'cover'}} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {blog.blogTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                        {blog.blogDescription.length > 50 
                          ? `${blog.blogDescription.substring(0, 50)}...` 
                          : blog.blogDescription
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {blog.blogCreatedBy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#2e7d32"
                        }}
                      >
                        Active
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ display: "flex", gap: "0.25rem" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleView(blog)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEdit(blog)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDelete(blog)}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
             Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredBlogs.length)} of {filteredBlogs.length} items
            </Typography>
            <Pagination
              count={Math.ceil(filteredBlogs.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* View Dialog */}
      <CommonDialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        dialogTitle="View Blog Details"
        dialogContent={<ViewBlog selectedData={selectedData} />}
        showActions={false}
        maxWidth="md"
      />

      {/* Create Dialog */}
      <CommonDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        dialogTitle="Create New Blog"
        dialogContent={
          <CreateBlog 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        }
        primaryAction={true}
        primaryActionText="Create"
        onPrimaryAction={handleSaveCreate}
        maxWidth="md"
      />

      {/* Edit Dialog */}
      <CommonDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        dialogTitle="Edit Blog"
        dialogContent={
          <EditBlog 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        }
        primaryAction={true}
        primaryActionText="Save Changes"
        onPrimaryAction={handleSaveEdit}
        maxWidth="md"
      />

      {/* Delete Dialog */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        dialogTitle="Delete Blog"
        dialogContent={<DeleteBlog selectedData={selectedData} />}
        primaryAction={true}
        primaryActionText="Delete"
        primaryActionColor="error"
        onPrimaryAction={handleConfirmDelete}
        maxWidth="sm"
      />

    </div>
  );
};

export default Blogs;
