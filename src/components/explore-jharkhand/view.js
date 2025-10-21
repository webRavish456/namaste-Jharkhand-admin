import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';

const View = ({ selectedData, getStatusColor }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Image
          </Typography>
          <Box sx={{ mb: 2 }}>
            <img 
              src={selectedData?.image} 
              alt={selectedData?.title} 
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }} 
            />
          </Box>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Title
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedData?.title}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedData?.description}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Chip 
                label="Active" 
                color="success" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default View;
