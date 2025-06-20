import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

// Import local weather icons
import sunnyIcon from '../assets/Icons/Sunny, Clear.png';
import partlyCloudyIcon from '../assets/Icons/Partly cloudy.png';
import cloudyIcon from '../assets/Icons/Cloudy, Overcast.png';
import rainIcon from '../assets/Icons/Rain.png';
import lightRainIcon from '../assets/Icons/Light Rain.png';
import thunderIcon from '../assets/Icons/Thunder Storm.png';
import snowIcon from '../assets/Icons/Snow.png';
import heavySnowIcon from '../assets/Icons/Heavy Snow.png';
import nightClearIcon from '../assets/Icons/Night, clear.png';
import nightPartlyCloudyIcon from '../assets/Icons/Partly cloudy Night.png';

const handleWheel = (e) => {
  if (e.deltaY !== 0) {
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  }
};

// Function to get the appropriate icon based on weather condition
const getWeatherIcon = (condition, time) => {
  if (!condition) return sunnyIcon;
  const conditionLower = condition.toLowerCase();
  
  // Check if it's night time (between 6 PM and 6 AM)
  const hour = new Date(time * 1000).getHours();
  const isNight = hour >= 18 || hour < 6;
  
  if (isNight) {
    if (conditionLower.includes('clear')) return nightClearIcon;
    if (conditionLower.includes('partly cloudy')) return nightPartlyCloudyIcon;
  }
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return sunnyIcon;
  if (conditionLower.includes('partly cloudy')) return partlyCloudyIcon;
  if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return cloudyIcon;
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return thunderIcon;
  if (conditionLower.includes('heavy snow')) return heavySnowIcon;
  if (conditionLower.includes('snow')) return snowIcon;
  if (conditionLower.includes('light rain') || conditionLower.includes('drizzle')) return lightRainIcon;
  if (conditionLower.includes('rain')) return rainIcon;
  return isNight ? nightClearIcon : sunnyIcon; // Default icon
};

const HourlyForecast = ({ hourlyData, tempUnit = 'C' }) => {
  if (!hourlyData || hourlyData.length === 0) return null;
  // Find the first hour >= now
  const now = Date.now();
  const startIdx = hourlyData.findIndex(h => h.time_epoch * 1000 >= now);
  const hoursToShow = startIdx === -1 ? hourlyData.slice(0, 48) : hourlyData.slice(startIdx, startIdx + 48);
  return (
    <Box sx={{ width: '100%', margin: '20px 0', p: 2, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Hourly Forecast
      </Typography>
      <Box className="forecast-scroll-x" sx={{ display: 'flex', gap: 2, pb: 2, width: '100%' }} onWheel={handleWheel}>
        {hoursToShow.map((hour, idx) => (
          <Card key={hour.time_epoch} sx={{ minWidth: 120, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {new Date(hour.time_epoch * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </Typography>
              <Typography variant="body2">
                {new Date(hour.time_epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              <img
                src={getWeatherIcon(hour.condition ? hour.condition.text : '', hour.time_epoch)}
                alt={hour.condition ? hour.condition.text : ''}
                style={{ width: 40, height: 40 }}
              />
              <Typography variant="h6">
                {Math.round(tempUnit === 'C' ? hour.temp_c : hour.temp_f)}°{tempUnit}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hour.condition ? hour.condition.text : ''}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HourlyForecast; 