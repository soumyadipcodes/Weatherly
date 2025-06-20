import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import visibilityTile from '../assets/Icons/tiles/Visibility.png';

const VisibilityCard = ({ value }) => (
  <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <img src={visibilityTile} alt="Visibility" style={{ width: 40, height: 40, marginBottom: 8 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Visibility
      </Typography>
      <Typography variant="h4">
        {value !== undefined && value !== '' ? value : '--'} km
      </Typography>
    </CardContent>
  </Card>
);

export default VisibilityCard; 