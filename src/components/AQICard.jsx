import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import aqiTile from '../assets/Icons/tiles/AQI.png';

const AQI_MIN = 0;
const AQI_MAX = 500;

const getAQIPosition = (value) => {
  if (value === undefined || value === null) return 0;
  let v = Math.max(AQI_MIN, Math.min(AQI_MAX, value));
  return ((v - AQI_MIN) / (AQI_MAX - AQI_MIN)) * 100;
};

const getAQIScore = (value) => {
  if (value === undefined || value === null) return '--';
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const AQICard = ({ value }) => {
  const pointerPosition = getAQIPosition(value);
  const score = getAQIScore(value);
  return (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <img src={aqiTile} alt="AQI" style={{ width: 40, height: 40, marginBottom: 8 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AQI
        </Typography>
        <Typography variant="h4">
          {score}
        </Typography>
        {/* Gradient AQI bar with pointer */}
        <Box sx={{ position: 'relative', width: '90%', height: 24, mx: 'auto', mt: 1, mb: 1 }}>
          {/* Gradient bar */}
          <Box sx={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #00e400 0%, #ffff00 25%, #ff7e00 50%, #ff0000 75%, #8f3f97 100%)',
            position: 'absolute',
            top: 2,
            left: 0,
          }} />
          {/* Pointer */}
          <Box sx={{
            position: 'absolute',
            left: `calc(${pointerPosition}% - 8px)`,
            top: -6,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '12px solid #fff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            zIndex: 2,
          }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%', mx: 'auto', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#00e400' }}>0</Typography>
          <Typography variant="caption" sx={{ color: '#ffff00' }}>100</Typography>
          <Typography variant="caption" sx={{ color: '#ff7e00' }}>200</Typography>
          <Typography variant="caption" sx={{ color: '#ff0000' }}>300</Typography>
          <Typography variant="caption" sx={{ color: '#8f3f97' }}>500</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AQICard; 