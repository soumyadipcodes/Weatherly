import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

const WeatherCard = ({ weatherData, todayData, tempUnit = 'C' }) => {
  if (!weatherData) return null;

  // WeatherAPI structure
  const cityName = weatherData.name || '';
  const condition = weatherData.condition ? weatherData.condition.text.toLowerCase() : '';
  const temp = tempUnit === 'C'
    ? (weatherData.temp_c !== undefined ? weatherData.temp_c : '')
    : (weatherData.temp_f !== undefined ? weatherData.temp_f : '');
  const maxTemp = todayData && todayData.day
    ? (tempUnit === 'C' ? todayData.day.maxtemp_c : todayData.day.maxtemp_f)
    : undefined;
  const minTemp = todayData && todayData.day
    ? (tempUnit === 'C' ? todayData.day.mintemp_c : todayData.day.mintemp_f)
    : undefined;

  // Check if it's night time
  const isNight = () => {
    if (!todayData || !todayData.astro) return false;
    const now = new Date();
    const sunrise = new Date(todayData.astro.sunrise);
    const sunset = new Date(todayData.astro.sunset);
    return now < sunrise || now > sunset;
  };

  // Function to get the appropriate icon based on weather condition
  const getWeatherIcon = (condition) => {
    if (!condition) return isNight() ? nightClearIcon : sunnyIcon;
    const conditionLower = condition.toLowerCase();
    
    if (isNight()) {
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
    return isNight() ? nightClearIcon : sunnyIcon; // Default icon
  };

  return (
    <Card sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: 'none' }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom sx={{ textAlign: 'center' }}>
          {cityName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <img
            src={getWeatherIcon(condition)}
            alt={condition}
            style={{ width: '100px', height: '100px' }}
          />
        </Box>
        <Typography variant="h3" component="div" sx={{ textAlign: 'center', mb: 2 }}>
          {temp !== '' ? Math.round(temp) : '--'}°{tempUnit}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
          {weatherData.condition ? weatherData.condition.text : ''}
        </Typography>
        {maxTemp !== undefined && minTemp !== undefined && (
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 1 }}>
            High: {Math.round(maxTemp)}°{tempUnit} &nbsp;|&nbsp; Low: {Math.round(minTemp)}°{tempUnit}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 