import React, { useState, useEffect } from 'react';
import { TextField, Box, Grid, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const Edit = ({ formData, handleInputChange, errors = {}, setFormErrors }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.blogImage || null);

  useEffect(() => {
    setImagePreview(formData.blogImage || null);
  }, [formData.blogImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Update form data with the file
        handleInputChange({
          target: {
            name: 'blogImage',
            value: file
          }
        });
        // Clear image error when user selects an image
        if (errors.blogImage && setFormErrors) {
          setFormErrors(prev => ({
            ...prev,
            blogImage: ''
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
       <Grid size={12}>
           <Typography variant="subtitle2" gutterBottom>
             Select Blog Image *
           </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             <Button
               variant="outlined"
               component="label"
               startIcon={<CloudUpload />}
               sx={{ 
                 height: '56px',
                 border: errors.blogImage ? '2px dashed #d32f2f' : '2px dashed #ccc',
                 '&:hover': {
                   border: errors.blogImage ? '2px dashed #d32f2f' : '2px dashed #1976d2',
                   backgroundColor: errors.blogImage ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'
                 }
               }}
             >
               Choose New Blog Image
               <input
                 type="file"
                 hidden
                 accept="image/*"
                 onChange={handleImageChange}
               />
             </Button>
             {errors.blogImage && (
               <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                 {errors.blogImage}
               </Typography>
             )}
             {imagePreview && (
               <Box sx={{ mt: 2 }}>
                 <Typography variant="body2" color="textSecondary" gutterBottom>
                   Preview:
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
                 />
               </Box>
             )}
           </Box>
         </Grid>
        
        <Grid size={12}>
          <TextField
            fullWidth
            label="Blog Heading"
            name="blogHeading"
            value={formData.blogHeading || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors.blogHeading}
            helperText={errors.blogHeading}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Blog Title"
            name="blogTitle"
            value={formData.blogTitle || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors.blogTitle}
            helperText={errors.blogTitle}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Blog Date"
            name="blogDate"
            type="date"
            value={formData.blogDate || ''}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!!errors.blogDate}
            helperText={errors.blogDate}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Created By"
            name="blogCreatedBy"
            value={formData.blogCreatedBy || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors.blogCreatedBy}
            helperText={errors.blogCreatedBy}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Blog Description"
            name="blogDescription"
            value={formData.blogDescription || ''}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
            required
            error={!!errors.blogDescription}
            helperText={errors.blogDescription}
          />
        </Grid>
       
      </Grid>
    </Box>
  );
};

export default Edit;
