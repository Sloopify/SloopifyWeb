import React, { useState, useEffect } from 'react';
import API from '../../../../../../axios/axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';

const feelings_Data_URL = '/api/v1/stories/get-feeling';
const search_feelings_Data_URL = '/api/v1/stories/search-feeling';

const FeelingsStoryOption = ({ onSelectFeeling }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [feelingsList, setFeelingsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [feelingsPage, setFeelingsPage] = useState(1);
  const perPage = 10;
  const [feelingsTotalPages, setFeelingsTotalPages] = useState(1);

  // Fetch feelings
  const fetchFeelings = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? search_feelings_Data_URL : feelings_Data_URL;
      const payload = search
        ? { search }
        : { page: String(feelingsPage), per_page: String(perPage) };

      const res = await API.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setFeelingsList(res.data?.data.feelings || []);
      if (!search) {
        setFeelingsTotalPages(res.data?.data?.pagination?.last_page || 1);
      }
    } catch (err) {
      console.error("Failed to fetch feelings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial + page fetch
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchFeelings();
    }
  }, [feelingsPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchFeelings(searchTerm);
      } else {
        setFeelingsPage(1);
        fetchFeelings();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const renderFeelingItem = (feeling) => (
    <Grid item xs={12}
      key={feeling.id}
      onClick={() => onSelectFeeling(feeling)}
      sx={{
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        '&:hover': { backgroundColor: '#f1f5f9', borderRadius: '12px' },
        p: 2,
        borderBottom: '1px solid #E2E8F0'
      }}
    >
      <Box
        component="img"
        src={feeling.web_icon}
        alt={feeling.name}
        sx={{ width: 48, height: 48 }}
      />
      <Typography variant="body2" sx={{
        color: '#475569',
        fontSize: '14px',
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
        marginLeft: '10px'
      }}>
        {feeling.name}
      </Typography>
    </Grid>
  );

  return (
    <Box sx={{ marginTop: '20px' }}>
      <TextField
        fullWidth
        placeholder="Search feelings..."
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
      ) : feelingsList.length > 0 ? (
        <>
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {feelingsList.map(renderFeelingItem)}
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={feelingsTotalPages}
              page={feelingsPage}
              onChange={(e, value) => setFeelingsPage(value)}
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
          {searchTerm ? 'No feelings found' : 'No feelings available'}
        </Typography>
      )}
    </Box>
  );
};

export default FeelingsStoryOption;
