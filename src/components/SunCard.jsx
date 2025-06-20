import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import sunTile from '../assets/Icons/tiles/Sunrise & Sunset.png';

const SunCard = ({ sunrise, sunset }) => {
  // Convert time strings to minutes since midnight
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + minutes;
  };

  const getCurrentTimeMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const sunriseMinutes = timeToMinutes(sunrise);
  const sunsetMinutes = timeToMinutes(sunset);
  const currentMinutes = getCurrentTimeMinutes();
  const totalDayMinutes = 24 * 60;

  // Calculate positions as percentages
  const sunrisePosition = (sunriseMinutes / totalDayMinutes) * 100;
  const sunsetPosition = (sunsetMinutes / totalDayMinutes) * 100;
  const currentPosition = (currentMinutes / totalDayMinutes) * 100;

  // Determine if it's day or night
  const isDay = currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes;

  return (
    <Card sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <img src={sunTile} alt="Sunrise & Sunset" style={{ width: 40, height: 40, marginBottom: 8 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Sunrise & Sunset
        </Typography>
        
        {/* Heat line visualization */}
        <Box sx={{ position: 'relative', height: 80, mb: 2, mt: 2 }}>
          {/* Background gradient */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 4,
            transform: 'translateY(-50%)',
            background: 'linear-gradient(90deg, #1a237e 0%, #ff9800 50%, #1a237e 100%)',
            borderRadius: '2px',
            opacity: 0.8,
            boxShadow: '0 0 10px rgba(255,152,0,0.3)'
          }} />
          
          {/* Sunrise marker */}
          <Box sx={{
            position: 'absolute',
            left: `${sunrisePosition}%`,
            top: '20%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5
          }}>
            <WbSunnyIcon sx={{ color: '#ff9800', fontSize: 20, filter: 'drop-shadow(0 0 5px rgba(255,152,0,0.5))' }} />
            <Typography variant="caption" sx={{ color: 'white', whiteSpace: 'nowrap', textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
              {sunrise}
            </Typography>
          </Box>

          {/* Sunset marker */}
          <Box sx={{
            position: 'absolute',
            left: `${sunsetPosition}%`,
            top: '20%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5
          }}>
            <NightsStayIcon sx={{ color: '#1a237e', fontSize: 20, filter: 'drop-shadow(0 0 5px rgba(26,35,126,0.5))' }} />
            <Typography variant="caption" sx={{ color: 'white', whiteSpace: 'nowrap', textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
              {sunset}
            </Typography>
          </Box>

          {/* Current time indicator */}
          <Box sx={{
            position: 'absolute',
            left: `${currentPosition}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 2,
            height: 20,
            backgroundColor: isDay ? '#ff9800' : '#1a237e',
            boxShadow: `0 0 10px ${isDay ? 'rgba(255,152,0,0.8)' : 'rgba(26,35,126,0.8)'}`,
            borderRadius: '1px'
          }} />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {isDay ? 'Daytime' : 'Nighttime'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SunCard; 