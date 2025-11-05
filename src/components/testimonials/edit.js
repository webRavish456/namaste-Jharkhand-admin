import React, { useState, useEffect } from 'react';
import { TextField, Box, Grid, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const Edit = ({ formData, handleInputChange, errors = {}, setFormErrors }) => {
  const [imagePreview, setImagePreview] = useState(formData.image || null);

  useEffect(() => {
    // If formData has an existing image URL, set it as preview
    if (formData.image && typeof formData.image === 'string') {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // Update form data with the file
        handleInputChange({
          target: {
            name: 'image',
            value: file
          }
        });
        // Clear image error when user selects an image
        if (errors.image && setFormErrors) {
          setFormErrors(prev => ({
            ...prev,
            image: ''
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
            Select Testimonial Image
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ 
                height: '56px',
                border: errors.image ? '2px dashed #d32f2f' : '2px dashed #ccc',
                '&:hover': {
                  border: errors.image ? '2px dashed #d32f2f' : '2px dashed #1976d2',
                  backgroundColor: errors.image ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              {imagePreview ? 'Change Image' : 'Choose Testimonial Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {errors.image && (
              <Typography variant="caption" color="error" sx={{ ml: 2, display: 'block', position: 'relative', top: '-14px' }}>
                {errors.image}
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
            placeholder="e.g., Awesome Trip, Great Experience"
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date || ''}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={!!errors.date}
            helperText={errors.date}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            fullWidth
            label="Author Name"
            name="authorName"
            value={formData.authorName || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors.authorName}
            helperText={errors.authorName}
            placeholder="e.g., Ms Margot Scholz"
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
            rows={6}
            required
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Enter testimonial description..."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Edit;

