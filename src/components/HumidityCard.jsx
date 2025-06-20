import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import humidityTile from '../assets/Icons/tiles/Humidity.png';

const HumidityCard = ({ value }) => (
  <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
    <CardContent sx={{ textAlign: 'center', p: 2 }}>
      <img src={humidityTile} alt="Humidity" style={{ width: 40, height: 40, marginBottom: 8 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Humidity
      </Typography>
      <Typography variant="h4">
        {value !== undefined && value !== '' ? value : '--'}%
      </Typography>
      {/* Humidity level bar */}
      <Box sx={{ position: 'relative', width: '90%', height: 12, mx: 'auto', mt: 0.2 }}>
        {/* Background bar */}
        <Box sx={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #b2fefa 0%, #0ed2f7 100%)',
          opacity: 0.3,
          position: 'absolute',
          top: 2,
          left: 0,
        }} />
        {/* Filled bar */}
        <Box sx={{
          width: `${value !== undefined && value !== '' ? value : 0}%`,
          height: 8,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #0ed2f7 0%, #0072ff 100%)',
          position: 'absolute',
          top: 2,
          left: 0,
          transition: 'width 0.5s',
        }} />
        {/* Pointer */}
        <Box sx={{
          position: 'absolute',
          left: `calc(${value !== undefined && value !== '' ? value : 0}% - 8px)`,
          top: -6,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '10px solid #0072ff',
          zIndex: 2,
        }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%', mx: 'auto', mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#b2fefa' }}>0%</Typography>
        <Typography variant="caption" sx={{ color: '#0072ff' }}>100%</Typography>
      </Box>
    </CardContent>
  </Card>
);

export default HumidityCard; 