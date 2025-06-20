import { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Card, CardContent, Typography, Grid, IconButton, Drawer, Box, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import CloudIcon from '@mui/icons-material/Cloud';
import MapIcon from '@mui/icons-material/Map';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import AQICard from './components/AQICard';
import SunCard from './components/SunCard';
import HumidityCard from './components/HumidityCard';
import WindCard from './components/WindCard';
import UVCard from './components/UVCard';
import PressureCard from './components/PressureCard';
import VisibilityCard from './components/VisibilityCard';
import WeatherMapCard from './components/WeatherMapCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import mainLogo from './assets/Icons/main.png';

// Import local weather icons
import sunnyIcon from './assets/Icons/Sunny, Clear.png';
import partlyCloudyIcon from './assets/Icons/Partly cloudy.png';
import cloudyIcon from './assets/Icons/Cloudy, Overcast.png';
import rainIcon from './assets/Icons/Rain.png';
import lightRainIcon from './assets/Icons/Light Rain.png';
import thunderIcon from './assets/Icons/Thunder Storm.png';
import snowIcon from './assets/Icons/Snow.png';
import heavySnowIcon from './assets/Icons/Heavy Snow.png';
import nightClearIcon from './assets/Icons/Night, clear.png';
import nightPartlyCloudyIcon from './assets/Icons/Partly cloudy Night.png';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: "'Josefin Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});

const RECENT_SEARCHES_KEY = 'weather_recent_searches';

function getBackgroundStyle(condition) {
  if (!condition) return {
    background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)'
  };
  const cond = condition.toLowerCase();
  
  if (cond.includes('sunny') || cond.includes('clear')) {
    return { 
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      boxShadow: '0 0 50px rgba(253, 160, 133, 0.3)'
    };
  }
  if (cond.includes('partly cloudy')) {
    return { 
      background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      boxShadow: '0 0 50px rgba(161, 196, 253, 0.3)'
    };
  }
  if (cond.includes('cloudy') || cond.includes('overcast')) {
    return { 
      background: 'linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)',
      boxShadow: '0 0 50px rgba(117, 127, 154, 0.3)'
    };
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return { 
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      boxShadow: '0 0 50px rgba(52, 152, 219, 0.3)'
    };
  }
  if (cond.includes('thunder') || cond.includes('storm')) {
    return { 
      background: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
      boxShadow: '0 0 50px rgba(66, 134, 244, 0.3)'
    };
  }
  if (cond.includes('snow')) {
    return { 
      background: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
      boxShadow: '0 0 50px rgba(238, 241, 245, 0.3)'
    };
  }
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
    return { 
      background: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      boxShadow: '0 0 50px rgba(96, 108, 136, 0.3)'
    };
  }
  return { 
    background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
    boxShadow: '0 0 50px rgba(0, 180, 219, 0.3)'
  };
}

function getBackgroundVideo(condition) {
  if (!condition) return '/assets/background/Sunny, Clear, Partly Cloudy.mp4';
  const cond = condition.toLowerCase();
  if (cond.includes('sunny') || cond.includes('clear') || cond.includes('partly cloudy')) {
    return '/assets/background/Sunny, Clear, Partly Cloudy.mp4';
  }
  if (cond.includes('cloudy') || cond.includes('overcast') || cond.includes('rain') || cond.includes('light rain')) {
    return '/assets/background/Cloudy, Overecast, Rain, Light Rain.mp4';
  }
  if (cond.includes('thunder') || cond.includes('storm')) {
    return '/assets/background/Thunder Storm.mp4';
  }
  if (cond.includes('snow')) {
    return '/assets/background/Snow, Heavy Snow.mov';
  }
  return '/assets/background/Sunny, Clear, Partly Cloudy.mp4';
}

// Function to get the appropriate icon based on weather condition
const getWeatherIcon = (condition, isNight = false) => {
  if (!condition) return isNight ? nightClearIcon : sunnyIcon;
  const conditionLower = condition.toLowerCase();
  
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

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  const [recentLocations, setRecentLocations] = useState([]);

  // Replace with your WeatherAPI key
  const API_KEY = 'ADD_YOUR_API_KEY';
  const WEATHERAPI_URL = 'https://api.weatherapi.com/v1/forecast.json';

  // Load recent locations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentLocations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!weatherData) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`${lat},${lon}`);
          },
          (err) => {
            // If permission denied or error, fallback to IP
            fetch('https://ipinfo.io/json')
              .then(res => res.json())
              .then(data => {
                if (data && data.city) {
                  fetchWeather(data.city);
                }
              })
              .catch(() => {
                // Optionally handle error or fallback
              });
          }
        );
      } else {
        // If geolocation not supported, fallback to IP
        fetch('https://ipinfo.io/json')
          .then(res => res.json())
          .then(data => {
            if (data && data.city) {
              fetchWeather(data.city);
            }
          })
          .catch(() => {
            // Optionally handle error or fallback
          });
      }
    }
    // eslint-disable-next-line
  }, []);

  const fetchWeather = async (city) => {
    try {
      setError('');
      // WeatherAPI: Get forecast for city (current, 8 days, hourly)
      const res = await axios.get(WEATHERAPI_URL, {
        params: {
          key: API_KEY,
          q: city,
          days: 8,
          aqi: 'yes',
          alerts: 'no',
        },
      });
      const data = res.data;
      // Current weather
      setWeatherData({ ...data.current, name: data.location.name });
      // 48 hours of hourly data (WeatherAPI gives 24h per day, so combine)
      let hours = [];
      data.forecast.forecastday.forEach(day => {
        hours = hours.concat(day.hour);
      });
      setHourlyData(hours.slice(0, 48));
      // 8 days of daily data
      setDailyData(data.forecast.forecastday.slice(0, 8));
    } catch (err) {
      setError('City not found or API error. Please try again.');
      setWeatherData(null);
      setHourlyData([]);
      setDailyData([]);
    }
  };

  const handleWheel = (e) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const MetricCard = ({ icon: Icon, title, value, unit }) => (
    <Card sx={{ 
      height: '100%',
      backgroundColor: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: 'none',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Icon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">
          {value !== undefined && value !== '' ? value : '--'}{unit}
        </Typography>
      </CardContent>
    </Card>
  );

  const handleLocationClick = (location) => {
    if (location.lat && location.lon) {
      fetchWeather(`${location.lat},${location.lon}`);
    } else {
      fetchWeather(location.display);
    }
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className="d-flex flex-column align-items-center justify-content-start"
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'auto',
          ...getBackgroundStyle(weatherData && weatherData.condition && weatherData.condition.text),
          transition: 'background 1s ease-in-out, box-shadow 1s ease-in-out'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            pointerEvents: 'none',
            opacity: 0.3,
            transition: 'opacity 1s ease-in-out'
          }}
          src={getBackgroundVideo(weatherData && weatherData.condition && weatherData.condition.text)}
        />
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
            },
            zIndex: 1000,
          }}
        >
          <MenuIcon sx={{ color: '#fff' }} />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 300,
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              color: '#fff',
            }
          }}
        >
          <Box sx={{ mt: 8, px: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempUnit === 'F'}
                  onChange={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
                  color="primary"
                />
              }
              label={tempUnit === 'C' ? 'Show °C' : 'Show °F'}
              sx={{ color: '#fff', mb: 2 }}
            />
            
            {/* Recent Locations Section */}
            <Typography variant="h6" sx={{ color: '#fff', mb: 2, mt: 3 }}>
              Recent Locations
            </Typography>
            <List>
              {recentLocations.map((location, index) => (
                <ListItem key={location.display + index} disablePadding sx={{ mb: 1 }}>
                  <Card 
                    sx={{ 
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      border: 'none',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                      }
                    }}
                  >
                    <ListItemButton onClick={() => handleLocationClick(location)}>
                      <ListItemAvatar>
                        <Avatar 
                          src={getWeatherIcon(location.condition, location.isNight)}
                          alt={location.condition || ''} 
                          sx={{ width: 40, height: 40, bgcolor: 'transparent' }} 
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={location.display}
                        secondary={location.temp_c !== undefined ? `${location.temp_c}°C${location.condition ? ' • ' + location.condition : ''}` : ''}
                        primaryTypographyProps={{ color: '#fff' }}
                        secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                      />
                    </ListItemButton>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <div style={{ width: '100vw', marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <SearchBar onSearch={fetchWeather} />
            {error && (
              <div className="alert alert-danger text-center my-3" style={{ position: 'absolute', top: 60, left: 0, right: 0 }}>
                {error}
              </div>
            )}
          </div>

          {weatherData && (
            <>
              <div className="card bg-white bg-opacity-10 backdrop-blur shadow-lg border-0 rounded-4 mb-4">
                <div className="card-body">
                  <WeatherCard weatherData={weatherData} todayData={dailyData[0]} tempUnit={tempUnit} />
                </div>
              </div>

              {/* 48 Hour Forecast - full width, horizontal scroll */}
              <div style={{ width: '100%', marginBottom: 24 }}>
                <div className="card bg-white bg-opacity-10 backdrop-blur shadow-lg border-0 rounded-4 mb-4" style={{ width: '100%' }}>
                  <div className="card-body" style={{ padding: 0 }}>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
                      <HourlyForecast hourlyData={hourlyData} onWheel={handleWheel} tempUnit={tempUnit} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CSS Grid Dashboard Layout */}
              <div className="dashboard-grid">
                {/* 8 Day Forecast */}
                <div className="dashboard-weekly">
                  <WeeklyForecast dailyData={dailyData} onWheel={handleWheel} tempUnit={tempUnit} />
                </div>
                {/* AQI */}
                <div className="dashboard-aqi">
                  <AQICard value={weatherData.air_quality?.pm2_5} />
                </div>
                {/* Sunrise & Sunset */}
                <div className="dashboard-sun">
                  <SunCard
                    sunrise={dailyData[0]?.astro?.sunrise}
                    sunset={dailyData[0]?.astro?.sunset}
                  />
                </div>
                {/* Humidity, Wind Speed, UV Index as a row */}
                <div className="dashboard-humidity">
                  <div className="dashboard-metrics-row">
                    <HumidityCard value={weatherData.humidity} />
                  </div>
                </div>
                {/* Weather Map */}
                <div className="dashboard-map">
                  <WeatherMapCard lat={weatherData.lat} lon={weatherData.lon} />
                </div>
                {/* Pressure */}
                <div className="dashboard-pressure">
                  <PressureCard value={weatherData.pressure_mb} />
                </div>
                {/* Visibility */}
                <div className="dashboard-visibility">
                  <VisibilityCard value={weatherData.vis_km} />
                </div>
                {/* Wind Speed */}
                <div className="dashboard-wind">
                  <WindCard value={Math.round(weatherData.wind_kph)} windDir={weatherData.wind_dir} />
                </div>
                {/* UV Index */}
                <div className="dashboard-uv">
                  <UVCard value={weatherData.uv} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logo and App Name in top left */}
        <div style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 44,
          padding: '6px 18px 6px 10px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(12px)'
        }}>
          <img src={mainLogo} alt="Weatherly Logo" style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
          <span style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 700, fontSize: 28, color: '#fff', letterSpacing: 1 }}>Weatherly</span>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App; 