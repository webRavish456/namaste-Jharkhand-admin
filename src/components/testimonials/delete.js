import React from 'react';
import { Box, Typography } from '@mui/material';

const Delete = ({ selectedData }) => {
  if (!selectedData) {
    return (
      <Box>
        <Typography variant="body2" color="textSecondary">
          No testimonial selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="body1" sx={{ mb: 2.5, color: '#1e293b', lineHeight: 1.6 }}>
        Are you sure you want to delete this testimonial?
      </Typography>
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        mb: 2.5
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75, color: '#1e293b', fontSize: '0.9375rem' }}>
          Title: {selectedData.title || 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
          Author: {selectedData.authorName || 'N/A'}
        </Typography>
      </Box>
      <Typography variant="body2" color="error" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
        This action cannot be undone.
      </Typography>
    </Box>
  );
};

export default Delete;

