import React from 'react';
import { Box, Typography, Alert, Grid } from '@mui/material';

const Delete = ({ selectedData }) => {
  return (
    <Box sx={{ mt: 2 }}>
     <Grid size={12}>
                <Typography>
                    Are you sure you want to delete{" "}
                    <b>{selectedData?.title}</b>?
                </Typography>
            </Grid>

    </Box>
  );
};

export default Delete;
