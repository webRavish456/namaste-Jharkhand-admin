import React, { useState, useEffect } from 'react';
import { TextField, Box, Grid, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const Edit = ({ formData, handleInputChange, errors = {}, selectedData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Reset selectedImage when component mounts with new data
  useEffect(() => {
    console.log('Component mounted/reset - clearing selectedImage');
    setSelectedImage(null);
  }, [selectedData]);
  // Force update image preview when component mounts or data changes
  useEffect(() => {
    console.log('Edit component - selectedData:', selectedData);
    console.log('Edit component - formData.exploreImage:', formData.exploreImage);
    console.log('Edit component - selectedImage:', selectedImage);
    
    // Only set initial image if no new image has been selected
    if (!selectedImage) {
      // Priority: selectedData.image > formData.exploreImage
      const imageToShow = selectedData?.image || selectedData?.exploreImage || formData.exploreImage;
      
      if (imageToShow) {
        console.log('Setting initial image preview to:', imageToShow);
        setImageError(false); // Reset error state
        setImagePreview(imageToShow);
      } else {
        console.log('No initial image found, setting preview to null');
        setImagePreview(null);
        setImageError(false);
      }
    }
  }, [selectedData, formData.exploreImage, selectedImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('handleImageChange called with file:', file);
    if (file) {
      setSelectedImage(file);
      console.log('Selected image set to:', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader onload - setting new image preview');
        setImagePreview(e.target.result);
        setImageError(false);
        // Update form data with the file
        handleInputChange({
          target: {
            name: 'exploreImage',
            value: file
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
       <Grid size={12}>
           <Typography variant="subtitle2" gutterBottom>
             Explore Jharkhand Image *
           </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             <Button
               variant="outlined"
               component="label"
               startIcon={<CloudUpload />}
               sx={{ 
                 height: '56px',
                 border: errors.exploreImage ? '2px dashed #d32f2f' : '2px dashed #ccc',
                 '&:hover': {
                   border: errors.exploreImage ? '2px dashed #d32f2f' : '2px dashed #1976d2',
                   backgroundColor: errors.exploreImage ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'
                 }
               }}
             >
               {imagePreview ? 'Change Image' : 'Choose Image'}
               <input
                 type="file"
                 hidden
                 accept="image/*"
                 onChange={handleImageChange}
               />
             </Button>
             {errors.exploreImage && (
               <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                 {errors.exploreImage}
               </Typography>
             )}
             {imagePreview && !imageError && (
               <Box sx={{ mt: 2 }}>
                 <Typography variant="body2" color="textSecondary" gutterBottom>
                   {selectedImage ? 'New Image Preview:' : 'Current Image:'}
                 </Typography>
                 <img
                   src={imagePreview}
                   alt="Preview"
                   style={{
                     width: '100%',
                     maxWidth: '300px',
                     height: '200px',
                     objectFit: 'cover',
                     borderRadius: '8px',
                     border: '1px solid #e0e0e0'
                   }}
                   onError={(e) => {
                     console.log('Image failed to load:', imagePreview);
                     setImageError(true);
                     e.target.style.display = 'none';
                   }}
                   onLoad={() => {
                     console.log('Image loaded successfully:', imagePreview);
                     setImageError(false);
                   }}
                 />
               </Box>
             )}
             {imagePreview && imageError && (
               <Box sx={{ mt: 2 }}>
                 <Typography variant="body2" color="textSecondary" gutterBottom>
                   {selectedImage ? 'New Image Preview:' : 'Current Image:'}
                 </Typography>
                 <Box sx={{
                   width: '100%',
                   maxWidth: '300px',
                   height: '200px',
                   borderRadius: '8px',
                   border: '1px solid #e0e0e0',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   backgroundColor: '#f5f5f5',
                   color: '#666'
                 }}>
                   <Typography variant="body2">
                     Image failed to load
                   </Typography>
                 </Box>
               </Box>
             )}
           </Box>
         </Grid>
        
        <Grid size={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
       
      </Grid>
    </Box>
  );
};

export default Edit;
