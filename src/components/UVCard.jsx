import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import uvTile from '../assets/Icons/tiles/UV.png';

const UVCard = ({ value }) => {
  // Function to get UV level description and color
  const getUVInfo = (uv) => {
    if (!uv) return { level: 'N/A', color: '#808080' };
    if (uv <= 2) return { level: 'Low', color: '#558B2F' };
    if (uv <= 5) return { level: 'Moderate', color: '#F9A825' };
    if (uv <= 7) return { level: 'High', color: '#EF6C00' };
    if (uv <= 10) return { level: 'Very High', color: '#D84315' };
    return { level: 'Extreme', color: '#B71C1C' };
  };

  // Get UV info based on current value
  const uvInfo = getUVInfo(value);
  
  // Calculate the percentage for the progress bar (0-11+ scale)
  const getProgressPercentage = (uv) => {
    if (!uv) return 0;
    return Math.min((uv / 11) * 100, 100);
  };

  return (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <img src={uvTile} alt="UV Index" style={{ width: 40, height: 40 }} />
        </Box>
        
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ textAlign: 'center' }}>
          UV Index
        </Typography>

        <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
          {value !== undefined && value !== '' ? value : '--'}
        </Typography>

        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2, color: uvInfo.color }}>
          {uvInfo.level}
        </Typography>

        {/* UV Progress Bar Container */}
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: '12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '6px',
          overflow: 'hidden',
          mt: 2
        }}>
          {/* UV Progress Bar Fill */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${getProgressPercentage(value)}%`,
            background: `linear-gradient(90deg, 
              #558B2F 0%, 
              #558B2F 18%, 
              #F9A825 18%, 
              #F9A825 45%, 
              #EF6C00 45%, 
              #EF6C00 63%, 
              #D84315 63%, 
              #D84315 90%, 
              #B71C1C 90%, 
              #B71C1C 100%
            )`,
            transition: 'width 1s ease-out',
          }} />
        </Box>

        {/* UV Scale Markers */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 1,
          px: 0.5,
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.7)'
        }}>
          <span>0</span>
          <span>2</span>
          <span>5</span>
          <span>7</span>
          <span>10</span>
          <span>11+</span>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UVCard; 