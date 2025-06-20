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

// Function to get the appropriate icon based on weather condition
const getWeatherIcon = (condition, date) => {
  if (!condition) return sunnyIcon;
  const conditionLower = condition.toLowerCase();
  
  // Check if it's night time (between 6 PM and 6 AM)
  const hour = new Date(date * 1000).getHours();
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

const WeeklyForecast = ({ dailyData, tempUnit = 'C' }) => {
  if (!dailyData || dailyData.length === 0) return null;
  return (
    <Box sx={{ width: '100%', margin: '20px 0', p: 2, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'left' }}>
        Weekly Forecast
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {dailyData.map((day, idx) => (
          <Card key={day.date_epoch} sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none', mb: 1 }}>
            <CardContent sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ minWidth: 120 }}>
                {new Date(day.date_epoch * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </Typography>
              <img
                src={getWeatherIcon(day.day && day.day.condition ? day.day.condition.text : '', day.date_epoch)}
                alt={day.day && day.day.condition ? day.day.condition.text : ''}
                style={{ width: 40, height: 40 }}
              />
              <Typography variant="h6" sx={{ minWidth: 120 }}>
                {Math.round(tempUnit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f)}° / {Math.round(tempUnit === 'C' ? day.day.mintemp_c : day.day.mintemp_f)}°{tempUnit}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>
                {day.day && day.day.condition ? day.day.condition.text : ''}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default WeeklyForecast; 