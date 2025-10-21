import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';

const View = ({ selectedData, getStatusColor }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Blog Image
          </Typography>
          <Box sx={{ mb: 2 }}>
            <img 
              src={selectedData?.blogImage} 
              alt={selectedData?.blogTitle} 
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
                Blog Heading
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedData?.blogHeading}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Blog Title
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                {selectedData?.blogTitle}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Blog Date
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedData?.blogDate ? new Date(selectedData.blogDate).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Created By
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                {selectedData?.blogCreatedBy}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Blog Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedData?.blogDescription}
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
