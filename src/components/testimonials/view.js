import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const View = ({ selectedData }) => {
  if (!selectedData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="textSecondary">
          No testimonial selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          {selectedData.image && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                Image:
              </Typography>
              <img
                src={selectedData.image}
                alt={selectedData.title || 'Testimonial'}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
          )}
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Title:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedData.title || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Date:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedData.date ? new Date(selectedData.date).toLocaleDateString() : 'N/A'}
          </Typography>
        </Grid>

        <Grid size={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Author Name:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedData.authorName || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Description:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
            {selectedData.description || 'N/A'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default View;

