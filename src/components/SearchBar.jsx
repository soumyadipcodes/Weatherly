import React, { useState, useRef, useEffect } from 'react';
import { TextField, IconButton, Box, Paper, List, ListItem, ListItemButton, ListItemText, Popper, ListItemAvatar, Avatar, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

const API_KEY = '19729cc5152c48c8a9d71627250506';
const RECENT_SEARCHES_KEY = 'weather_recent_searches';

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Function to get the appropriate icon based on weather condition and time
const getWeatherIcon = (condition, hour = null) => {
  if (!condition) return sunnyIcon;
  const conditionLower = condition.toLowerCase();
  let isNight = false;
  if (hour !== null) {
    isNight = hour >= 18 || hour < 6;
  }
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
  return isNight ? nightClearIcon : sunnyIcon;
};

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = (list) => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
  };

  // Add a search to recent searches
  const addRecentSearch = (searchObj) => {
    // Remove duplicates (by lat/lon if available, else by name string)
    let newList = recentSearches.filter(s => {
      if (searchObj.lat && searchObj.lon) {
        return !(s.lat === searchObj.lat && s.lon === searchObj.lon);
      } else {
        return s.display !== searchObj.display;
      }
    });
    newList.unshift(searchObj);
    if (newList.length > 5) newList = newList.slice(0, 5);
    setRecentSearches(newList);
    saveRecentSearches(newList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      // Find the suggestion if it matches
      const match = suggestions.find(s => s.name.toLowerCase() === city.trim().toLowerCase());
      if (match) {
        handleSuggestionClick(match);
      } else {
        onSearch(city);
        addRecentSearch({ display: city });
      }
      setShowSuggestions(false);
      setShowRecent(false);
    }
  };

  // Debounced fetch for suggestions and their weather
  const fetchSuggestions = debounce(async (value) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${value}`);
      let data = await res.json();
      data = data.slice(0, 5); // Limit to 5 suggestions
      // Fetch weather for each suggestion in parallel
      const weatherResults = await Promise.all(
        data.map(async (s) => {
          try {
            const wres = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${s.lat},${s.lon}`);
            const wdata = await wres.json();
            return {
              ...s,
              temp_c: wdata.current ? wdata.current.temp_c : null,
              icon: wdata.current && wdata.current.condition ? wdata.current.condition.icon : null,
              condition: wdata.current && wdata.current.condition ? wdata.current.condition.text : null,
              display: s.name + (s.region ? ', ' + s.region : '') + (s.country ? ', ' + s.country : ''),
            };
          } catch {
            return { ...s, display: s.name + (s.region ? ', ' + s.region : '') + (s.country ? ', ' + s.country : '') };
          }
        })
      );
      setSuggestions(weatherResults);
      setShowSuggestions(true);
      setShowRecent(false);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setLoading(false);
  }, 400);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 0) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowRecent(true);
    }
  };

  const handleSuggestionClick = (s) => {
    setCity(s.name);
    setShowSuggestions(false);
    setShowRecent(false);
    if (s.lat && s.lon) {
      onSearch(`${s.lat},${s.lon}`);
      addRecentSearch({
        lat: s.lat,
        lon: s.lon,
        display: s.display || (s.name + (s.region ? ', ' + s.region : '') + (s.country ? ', ' + s.country : '')),
        icon: s.icon,
        temp_c: s.temp_c,
        condition: s.condition,
      });
    } else {
      onSearch(s.display || s.name);
      addRecentSearch({ display: s.display || s.name });
    }
  };

  // Show recent searches when input is focused and empty
  const handleInputFocus = () => {
    if (!city) {
      setShowRecent(true);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
      setShowRecent(false);
    }
  };

  // Hide dropdowns on blur
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowRecent(false);
    }, 100);
  };

  const handleRecentClick = (s) => {
    setCity(s.display);
    setShowRecent(false);
    setShowSuggestions(false);
    if (s.lat && s.lon) {
      onSearch(`${s.lat},${s.lon}`);
    } else {
      onSearch(s.display);
    }
    // Move this search to the top
    addRecentSearch(s);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 400,
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          padding: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          inputRef={inputRef}
          autoComplete="off"
          sx={{
            '& .MuiInputBase-root': {
              color: 'white',
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
            },
            '& .MuiInputBase-input': {
              padding: '8px 16px',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                type="submit"
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        {/* Suggestions Dropdown */}
        <Popper
          open={showSuggestions && (suggestions.length > 0 || loading) || showRecent}
          anchorEl={inputRef.current}
          placement="bottom-start"
          style={{ zIndex: 2000, width: inputRef.current ? inputRef.current.offsetWidth : undefined }}
        >
          <Paper sx={{
            mt: 1,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            maxHeight: 300,
            overflowY: 'auto',
            width: inputRef.current ? inputRef.current.offsetWidth : undefined,
          }} elevation={8}>
            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <List>
                {recentSearches.map((s, idx) => (
                  <ListItem key={s.display + idx} disablePadding>
                    <ListItemButton onMouseDown={() => handleRecentClick(s)}>
                      <ListItemAvatar>
                        <Avatar src={getWeatherIcon(s.condition, s.hour)} alt={s.condition || ''} sx={{ width: 32, height: 32, bgcolor: 'transparent' }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={s.display}
                        secondary={s.temp_c !== undefined && s.temp_c !== null ? `${s.temp_c}°C${s.condition ? ' • ' + s.condition : ''}` : ''}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            {/* Suggestions */}
            {(loading && suggestions.length === 0 && !showRecent) && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {suggestions.length > 0 && !showRecent && (
              <List>
                {suggestions.map((s) => (
                  <ListItem key={s.id || s.name} disablePadding>
                    <ListItemButton onMouseDown={() => handleSuggestionClick(s)}>
                      <ListItemAvatar>
                        <Avatar src={getWeatherIcon(s.condition, s.hour)} alt={s.condition || ''} sx={{ width: 32, height: 32, bgcolor: 'transparent' }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={s.name + (s.region ? ', ' + s.region : '') + (s.country ? ', ' + s.country : '')}
                        secondary={s.temp_c !== undefined && s.temp_c !== null ? `${s.temp_c}°C${s.condition ? ' • ' + s.condition : ''}` : ''}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Popper>
      </Box>
    </Box>
  );
};

export default SearchBar; 