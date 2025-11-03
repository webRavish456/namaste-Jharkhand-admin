'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Skeleton
} from '@mui/material';
import { ArrowBack, CloudUpload, Edit, Delete } from '@mui/icons-material';
import TipTapEditor from '@/components/TipTapEditor';

const ExploreJharkhandDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    bannerImage: null,
    introductionDescription: '',
    introductionImage: null,
    detailDescription: '',
    viewMoreImages: []
  });
  const [formErrors, setFormErrors] = useState({});

  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [introductionImagePreview, setIntroductionImagePreview] = useState(null);
  const [viewMoreImagesPreview, setViewMoreImagesPreview] = useState([]);

  useEffect(() => {
    setIsClient(true);
    if (params.id) {
      fetchExploreJharkhandDetails();
    }
  }, [params.id]);

  // API Functions
  const fetchExploreJharkhandDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand-details/explore/${params.id}`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showSnackbar('Session expired. Please login again', 'error');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch details');
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const detail = data.data[0];
        setFormData({
          title: detail.exploreJharkhandId?.title || '',
          bannerImage: null,
          introductionDescription: detail.introductionDescription || '',
          introductionImage: null,
          detailDescription: detail.detailDescription || '',
          viewMoreImages: []
        });
        setOriginalData(detail);
        
        // Set image previews
        if (detail.bannerImage) {
          setBannerImagePreview(detail.bannerImage);
        }
        if (detail.introductionImage) {
          setIntroductionImagePreview(detail.introductionImage);
        }
        if (detail.viewMoreImages && detail.viewMoreImages.length > 0) {
          setViewMoreImagesPreview(detail.viewMoreImages);
        }
      } else {
        // If no details exist, fetch the main explore data
        const mainResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand/${params.id}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        
        if (mainResponse.ok) {
          const mainData = await mainResponse.json();
          setFormData(prev => ({
            ...prev,
            title: mainData.data?.title || ''
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      showSnackbar('Failed to load details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateExploreJharkhandDetails = async () => {
    try {
      setSaving(true);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Please login again', 'error');
        router.push('/login');
        return;
      }
      
      const formDataToSend = new FormData();
      
      // Add the exploreJharkhandId (required field)
      formDataToSend.append('exploreJharkhandId', params.id);
      
      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }
      formDataToSend.append('introductionDescription', formData.introductionDescription);
      if (formData.introductionImage) {
        formDataToSend.append('introductionImage', formData.introductionImage);
      }
      formDataToSend.append('detailDescription', formData.detailDescription);
      
      // Handle multiple images
      formData.viewMoreImages.forEach((image, index) => {
        formDataToSend.append('viewMoreImages', image);
      });

      // Determine if this is an edit (PUT) or create (POST) operation
      const isEdit = originalData?._id;
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand-details/${originalData._id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand-details`;

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          showSnackbar('Session expired. Please login again', 'error');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error('Failed to save details');
      }
      
      showSnackbar('Details saved successfully!', 'success');
      setIsEditMode(false);
      await fetchExploreJharkhandDetails();
    } catch (err) {
      console.error('Error saving details:', err);
      showSnackbar('Failed to save details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteExploreJharkhandDetails = async () => {
    try {
      if (!originalData?._id) {
        showSnackbar('No details found to delete', 'warning');
        return;
      }
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Please login again', 'error');
        router.push('/login');
        return;
      }
      
      console.log('Deleting details with ID:', originalData._id);
      console.log('API URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand-details/${originalData._id}`);
      console.log('Token exists:', !!token);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/explore-jharkhand-details/${originalData._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 401) {
          showSnackbar('Session expired. Please login again', 'error');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to delete details');
      }
      
      showSnackbar('Details deleted successfully!', 'success');
      router.push('/explore-jharkhand');
    } catch (err) {
      console.error('Error deleting details:', err);
      showSnackbar(err.message || 'Failed to delete details', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.introductionDescription?.trim()) {
      errors.introductionDescription = 'Introduction description is required';
    }
    
    if (!formData.detailDescription?.trim()) {
      errors.detailDescription = 'Detail description is required';
    }
    
    // Check if banner image is required (either new image selected or existing image)
    if (!formData.bannerImage && !bannerImagePreview) {
      errors.bannerImage = 'Banner image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Action handlers
  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    router.push('/explore-jharkhand');
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    updateExploreJharkhandDetails();
  };

  const handleDelete = () => {
    if (!originalData?._id) {
      showSnackbar('No details found to delete', 'warning');
      return;
    }
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteExploreJharkhandDetails();
    setDeleteDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRichTextChange = (fieldName, content) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: content
    }));
    // Clear error when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };


  const handleImageChange = (type, e) => {
    const files = e.target.files;
    
    if (type === 'banner' || type === 'introduction') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'banner') {
            setBannerImagePreview(e.target.result);
            setFormData(prev => ({
              ...prev,
              bannerImage: file
            }));
            // Clear banner image error when user selects an image
            if (formErrors.bannerImage) {
              setFormErrors(prev => ({
                ...prev,
                bannerImage: ''
              }));
            }
          } else {
            setIntroductionImagePreview(e.target.result);
            setFormData(prev => ({
              ...prev,
              introductionImage: file
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'viewMore') {
      const fileArray = Array.from(files);
      const previews = [];
      
      fileArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target.result;
          setViewMoreImagesPreview([...previews]);
        };
        reader.readAsDataURL(file);
      });
      
      setFormData(prev => ({
        ...prev,
        viewMoreImages: [...prev.viewMoreImages, ...fileArray]
      }));
    }
  };

  const removeViewMoreImage = (index) => {
    const newPreviews = viewMoreImagesPreview.filter((_, i) => i !== index);
    const newFiles = formData.viewMoreImages.filter((_, i) => i !== index);
    
    setViewMoreImagesPreview(newPreviews);
    setFormData(prev => ({
      ...prev,
      viewMoreImages: newFiles
    }));
  };

  if (!isClient || loading) {
    return (
      <div className="content-area">
        {/* Header Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={300} height={40} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
          </Box>
        </Box>

        {/* Banner Image Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Form Fields Skeleton */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="text" width="40vw" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          
          <Grid size={12} xs={12}>
            <Skeleton variant="text" width="25%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={200} />
          </Grid>

          <Grid size={12} xs={12}>
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} />
          </Grid>

          <Grid size={12} xs={12}>
            <Skeleton variant="text" width="25%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={200} />
          </Grid>

          <Grid size={12} xs={12}>
            <Skeleton variant="text" width="35%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={300} />
          </Grid>

          <Grid size={12} xs={12}>
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rectangular" width={150} height={150} />
              <Skeleton variant="rectangular" width={150} height={150} />
              <Skeleton variant="rectangular" width={150} height={150} />
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className="content-area">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          {isEditMode ? (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving}
                sx={{ 
                  textTransform: 'none',
                  color: '#6b7280',
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: '#28a745',
                  '&:hover': {
                    backgroundColor: '#218838'
                  }
                }}
              >
                {saving ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{ 
                  textTransform: 'none',
                  color: '#6b7280',
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb'
                  }
                }}
              >
                Edit
              </Button>
              {originalData?._id && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  sx={{ 
                    textTransform: 'none',
                    color: '#dc2626',
                    borderColor: '#dc2626',
                    '&:hover': {
                      borderColor: '#b91c1c',
                      backgroundColor: '#fef2f2'
                    }
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
  
        <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: '2rem' }}>
          <Grid container spacing={4}>
    
            {/* Banner Image */}
            <Grid size={12} xs={12} md={12} lg={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Banner Image
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  disabled={!isEditMode}
                  sx={{ 
                    height: '56px',
                    border: '2px dashed #ccc',
                    '&:hover': {
                      border: '2px dashed #1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Choose Banner Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    disabled={!isEditMode}
                    onChange={(e) => handleImageChange('banner', e)}
                  />
                </Button>
                {bannerImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={bannerImagePreview}
                      alt="Banner Preview"
                      style={{
                        width: '100%',
                        maxWidth: '500px',
                        height: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}
                {formErrors.bannerImage && (
                  <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                    {formErrors.bannerImage}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Introduction Description */}
            <Grid size={12} xs={12} md={12} lg={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Introduction Description
              </Typography>
              <TipTapEditor
                content={formData.introductionDescription}
                onChange={(content) => handleRichTextChange('introductionDescription', content)}
                placeholder="Enter introduction description..."
                editable={isEditMode}
              />
              {formErrors.introductionDescription && (
                <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                  {formErrors.introductionDescription}
                </Typography>
              )}
            </Grid>

            {/* Introduction Image */}
            <Grid size={12} xs={12} md={12} lg={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Introduction Image
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  disabled={!isEditMode}
                  sx={{ 
                    height: '56px',
                    border: '2px dashed #ccc',
                    '&:hover': {
                      border: '2px dashed #1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Choose Introduction Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    disabled={!isEditMode}
                    onChange={(e) => handleImageChange('introduction', e)}
                  />
                </Button>
                {introductionImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={introductionImagePreview}
                      alt="Introduction Preview"
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Detail Description */}
            <Grid size={12} xs={12} md={12} lg={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Detail Description
              </Typography>
              <TipTapEditor
                content={formData.detailDescription}
                onChange={(content) => handleRichTextChange('detailDescription', content)}
                placeholder="Enter detail description..."
                editable={isEditMode}
              />
              {formErrors.detailDescription && (
                <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                  {formErrors.detailDescription}
                </Typography>
              )}
            </Grid>

            {/* View More Images */}
            <Grid size={12} xs={12} md={12} lg={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                View More Images
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  disabled={!isEditMode}
                  sx={{ 
                    height: '56px',
                    border: '2px dashed #ccc',
                    '&:hover': {
                      border: '2px dashed #1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Choose Multiple Images
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    disabled={!isEditMode}
                    onChange={(e) => handleImageChange('viewMore', e)}
                  />
                </Button>
                
                {viewMoreImagesPreview.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Images:
                    </Typography>
                    <Grid container spacing={2}>
                      {viewMoreImagesPreview.map((preview, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0'
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeViewMoreImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.7)'
                                }
                              }}
                            >
                              ×
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
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
          Delete Explore Jharkhand Details
        </DialogTitle>
        
        <DialogContent sx={{ px: 2, py: 1 }}>
          <Typography variant="body1" sx={{ color: '#333' }}>
            Are you sure you want to delete <strong>{formData.title || 'these details'}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pt: 2, pb: 1, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            sx={{ 
              textTransform: 'none',
              color: '#6b7280',
              borderColor: '#d1d5db',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ExploreJharkhandDetails;
