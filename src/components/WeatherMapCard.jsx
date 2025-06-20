import React from 'react';
import { Box } from '@mui/material';

const WeatherMapCard = ({ lat, lon }) => (
  <Box sx={{ width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden' }}>
    <iframe
      title="Weather Map"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0, minHeight: 200 }}
      src={
        lat && lon
          ? `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`
          : 'https://embed.windy.com/embed2.html?lat=20&lon=78&zoom=4&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1'
      }
      allowFullScreen
    ></iframe>
  </Box>
);

export default WeatherMapCard; 