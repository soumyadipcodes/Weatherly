import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import windTile from '../assets/Icons/tiles/Wind Speed.png';

const WindCard = ({ value, windDir }) => {
  // Convert wind direction to degrees
  const getWindDirection = (dir) => {
    if (!dir) return 0;
    const directions = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[dir] || 0;
  };

  // Add 180 degrees to show direction wind is coming from
  const rotation = (getWindDirection(windDir) + 180) % 360;

  return (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Icon at the top */}
        <Box sx={{ textAlign: 'center', mb: 0.5 }}>
          <img src={windTile} alt="Wind Speed" style={{ width: 40, height: 40 }} />
        </Box>

        <Grid container spacing={1} alignItems="center" sx={{ flex: 1, mt: -2 }}>
          {/* Left side - Compass */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 0.5, mt: -0.5 }}>
                Wind Direction
              </Typography>
              
              {/* Compass */}
              <Box sx={{ position: 'relative', width: 90, height: 90, mx: 'auto' }}>
                {/* Compass background */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Cardinal directions */}
                  <Box sx={{
                    position: 'absolute',
                    top: 5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#ff3333',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textShadow: '0 0 5px rgba(255,51,51,0.5)'
                  }}>
                    N
                  </Box>
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', color: '#fff' }}>S</Typography>
                  <Typography variant="caption" sx={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>W</Typography>
                  <Typography variant="caption" sx={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}>E</Typography>
                </Box>
                
                {/* Wind direction arrow */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 2,
                  height: '45%',
                  background: '#fff',
                  transformOrigin: 'bottom center',
                  transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '12px solid #fff',
                  }
                }} />
                
                {/* Center point */}
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#fff',
                  transform: 'translate(-50%, -50%)',
                }} />
              </Box>
              
              {/* Wind direction text */}
              <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>
                {windDir ? `Wind from ${windDir}` : '--'}
              </Typography>
            </Box>
          </Grid>

          {/* Right side - Wind Speed */}
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              pl: 2
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 0.5, mt: -0.5 }}>
                Wind Speed
              </Typography>
              <Typography variant="h3" sx={{ mb: 0.5 }}>
                {value !== undefined && value !== '' ? value : '--'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                km/h
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WindCard; 