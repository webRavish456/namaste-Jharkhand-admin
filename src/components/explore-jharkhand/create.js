import React, { useState } from 'react';
import { TextField, Box, Grid, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const Create = ({ formData, handleInputChange, errors = {} }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
               Choose Image
               <input
                 type="file"
                 hidden
                 accept="image/*"
                 onChange={handleImageChange}
               />
             </Button>
             {errors.exploreImage && (
               <Typography variant="caption" color="error" sx={{ ml: 2, display: 'block', position: 'relative', top: '-14px' }}>
                 {errors.exploreImage}
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

export default Create;
