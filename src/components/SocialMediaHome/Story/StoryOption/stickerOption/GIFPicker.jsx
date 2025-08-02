import React, { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch('WPWaUqDpw2IlzSujgU4wOvgfED1ow9mh');

const GIFPicker = ({ onSelect, setisGifDialogOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const fetchGifs = async (offset) => {
    setIsLoading(true);
    try {
      if (searchQuery) {
        const result = await gf.search(searchQuery, { offset, limit: 10 });
        return result;
      } else {
        const result = await gf.trending({ offset, limit: 10 });
        return result;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchMode(!!searchQuery);
  };

  return (
    <div style={{ width: '100%', marginTop: '30px' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search GIFs..."
          style={{
            color: '#475569',
            padding: '12px',
            backgroundColor: '#fff',
            width: '300px',
             borderRadius: '123px',
            border: '1px solid #CBD5E1',
            width:'95%'
          }}
        />
   
   
      </form>

      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#666'
        }}>
          Loading {searchQuery ? 'results' : 'trending GIFs'}...
        </div>
      )}

      {!isLoading && (
        <Grid
          key={searchQuery} // Force re-render when search changes
          width={750}
          columns={2}
          gutter={6}
          fetchGifs={fetchGifs}
          onGifClick={(gif, e) => {
            e.preventDefault();
            setisGifDialogOpen(false);
            onSelect(gif.images.original.url);
         
          }}
        />
      )}
    </div>
  );
};

export default GIFPicker;