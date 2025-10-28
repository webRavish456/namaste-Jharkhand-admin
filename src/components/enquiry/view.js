import React from 'react';
import { Box, Typography, Grid, Chip, Divider } from '@mui/material';

const View = ({ selectedData }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedData?.name}
              </Typography>
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedData?.email}
              </Typography>
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Phone Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedData?.phoneNumber}
              </Typography>
            </Grid>
            
            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Subject
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                {selectedData?.subject}
              </Typography>
            </Grid>
            
            <Grid size={{xs:12}}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Message
              </Typography>
              <Box 
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  p: 2,
                  minHeight: '120px'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedData?.message}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default View;
