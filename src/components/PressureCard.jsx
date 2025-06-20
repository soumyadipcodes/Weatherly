import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import pressureTile from '../assets/Icons/tiles/Pressure.png';

const PressureCard = ({ value }) => {
  // Normalize pressure value to a percentage (typical range: 950-1050 mb)
  const getPressurePercentage = (pressure) => {
    if (!pressure) return 0;
    const min = 950;
    const max = 1050;
    const normalized = ((pressure - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  // Calculate rotation angle for the needle (0-180 degrees)
  const getRotation = (pressure) => {
    const percentage = getPressurePercentage(pressure);
    return (percentage * 1.8) - 90; // Convert percentage to -90 to 90 degrees
  };

  const rotation = getRotation(value);

  return (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <img src={pressureTile} alt="Pressure" style={{ width: 40, height: 40 }} />
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Pressure
        </Typography>

        {/* Pressure Meter */}
        <Box sx={{ position: 'relative', width: 150, height: 75, mx: 'auto', mb: 2 }}>
          {/* Meter background */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '150px 150px 0 0',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderBottom: 'none',
            overflow: 'hidden',
          }}>
            {/* Gradient background */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #ff0000 0%, #ffcc00 50%, #00ff00 100%)',
              opacity: 0.4,
            }} />
          </Box>

          {/* Tick marks */}
          {[...Array(11)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: 2,
                height: 8,
                background: '#fff',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${i * 18 - 90}deg)`,
              }}
            />
          ))}

          {/* Needle */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 2,
            height: '70%',
            background: '#fff',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transition: 'transform 1s ease-out',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            }
          }} />

          {/* Pressure value */}
          <Typography 
            variant="h4" 
            sx={{ 
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              textShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
          >
            {value !== undefined && value !== '' ? value : '--'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              bottom: 5,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.7)'
            }}
          >
            mb
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PressureCard; 