import React, { useState, useEffect, useRef } from 'react';
import API from '../../../../../../axios/axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  IconButton,
  LinearProgress
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const audio_Data_URL = '/api/v1/stories/get-story-audio';
const search_audio_Data_URL = '/api/v1/stories/search-story-audio';

const AudioStoryOption = ({ onSelectAudio, selectedStoryAudio,currentlyPlaying, setCurrentlyPlaying, audioRef,progress, setProgress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(false);
 
 

  const [audioPage, setAudioPage] = useState(1);
  const perPage = 10;
  const [audioTotalPages, setAudioTotalPages] = useState(1);

  // Fetch audio
  const fetchAudio = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? search_audio_Data_URL : audio_Data_URL;
      const payload = search
        ? { search }
        : { page: String(audioPage), per_page: String(perPage) };

      const res = await API.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setAudioList(res.data?.data.audio || []);
      if (!search) {
        setAudioTotalPages(res.data?.data?.pagination?.last_page || 1);
      }
    } catch (err) {
      console.error("Failed to fetch audio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial + page fetch
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchAudio();
    }
  }, [audioPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchAudio(searchTerm);
      } else {
        setAudioPage(1);
        fetchAudio();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Progress tracking
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && currentlyPlaying) {
        const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percentage);
      }
    };
    
    const interval = setInterval(updateProgress, 500);
    return () => clearInterval(interval);
  }, [currentlyPlaying]);

  const togglePlay = (audio) => {
    if (currentlyPlaying === audio.id) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(audio.file_url);
      audioRef.current.play()
        .then(() => setCurrentlyPlaying(audio.id))
        .catch(err => console.error("Error playing audio:", err));
      
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
        setProgress(0);
      };
    }
  };

  const isAudioSelected = (audio) => {
    return selectedStoryAudio && selectedStoryAudio.id === audio.id;
  };

  const renderAudioItem = (audio) => (
    <Grid item xs={12}
      key={audio.id}
      sx={{
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': { 
          backgroundColor: '#f1f5f9', 
          borderRadius: '12px',
        },
        p: 2,
        borderRadius: '12px',
        borderBottom: '1px solid #E2E8F0',
        flexDirection: 'column',
        backgroundColor: isAudioSelected(audio) ? '#f1f5f9' : 'transparent',
        borderLeft: isAudioSelected(audio) ? '0px solid #14B8A6' : 'none',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* {isAudioSelected(audio) && (
        <CheckCircleIcon 
          sx={{
            position: 'absolute',
            top: 15,
            left: 15,
            color: '#14B8A6',
            fontSize: '20px',
          }}
        />
      )} */}
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        justifyContent: 'space-between',
        // pl: isAudioSelected(audio) ? 3 : 0,
      }}
        onClick={() => onSelectAudio(audio)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img"
            src={audio.image}
            alt={audio.name}
            sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%',
              cursor: 'pointer',
              objectFit: 'cover',
              mr: 2,
              border: isAudioSelected(audio) ? '2px solid #14B8A6' : 'none',
            }}
          />
          
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" sx={{
              color: isAudioSelected(audio) ? '#14B8A6' : '#1E293B',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Plus Jakarta Sans',
            }}>
              {audio.name}
            </Typography>
            <Typography variant="caption" sx={{
              color: isAudioSelected(audio) ? '#64748B' : '#64748B',
              fontSize: '12px',
              fontFamily: 'Plus Jakarta Sans',
            }}>
              {audio.duration_formatted} min • {audio.file_size_formatted}
            </Typography>
          </Box>
        </Box>
        
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            togglePlay(audio);
          }}
          sx={{ mr: 1 }}
        >
          {currentlyPlaying === audio.id ? (
            <PauseIcon sx={{ color: isAudioSelected(audio) ? '#14B8A6' : '#14B8A6' }} />
          ) : (
            <PlayArrowIcon sx={{ color: isAudioSelected(audio) ? '#14B8A6' : '#14B8A6' }} />
          )}
        </IconButton>
      </Box>

      {currentlyPlaying === audio.id && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{ 
              height: 4,
              '& .MuiLinearProgress-bar': { 
                backgroundColor: isAudioSelected(audio) ? '#14B8A6' : '#14B8A6',
                borderRadius: '2px'
              },
              borderRadius: '2px',
              backgroundColor: '#E2E8F0'
            }}
          />
        </Box>
      )}
    </Grid>
  );

  return (
    <Box sx={{ marginTop: '20px' }}>
      <TextField
        fullWidth
        placeholder="Search audio..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          input: {
            color: '#475569',
            padding: '12px',
            border: '0px',
            borderRadius: '123px',
            backgroundColor: '#fff'
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '123px',
            border: '0px solid #CBD5E1',
            height: '48px',
            backgroundColor: '#fff',
            '&.Mui-focused': {
              boxShadow: 'none',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} sx={{ color: '#14B8A6' }} />
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#14B8A6' }} />
        </Box>
      ) : audioList.length > 0 ? (
        <>
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {audioList.map(renderAudioItem)}
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={audioTotalPages}
              page={audioPage}
              onChange={(e, value) => setAudioPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: '700',
                  color: '#1E293B',
                  fontSize: '14px',
                },
                '& .Mui-selected': {
                  backgroundColor: '#14B8A6',
                  color: 'white',
                },
              }}
              shape="rounded"
            />
          </Grid>
        </>
      ) : (
        <Typography sx={{ p: 2, color: '#64748B' }}>
          {searchTerm ? 'No audio found' : 'No audio available'}
        </Typography>
      )}
    </Box>
  );
};

export default AudioStoryOption;