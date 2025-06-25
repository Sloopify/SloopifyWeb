import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@googlemaps/js-api-loader';

const MapComponent = ({ onLocationSelect, initialCoordinates, addressFields, onAddressChange }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSearchBox, setShowSearchBox] = useState(true);

  const roundCoord = (num) => Number(num.toFixed(6));

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyD6R4WUPVh2e3g2WiHhe7fYxrPDY5V5gGE',
      version: 'weekly',
      libraries: ['places'],
    });

    loader
      .load()
      .then(() => {
        if (!window.google || !window.google.maps) throw new Error('Google Maps API not available');
        geocoderRef.current = new window.google.maps.Geocoder();
        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('Error loading Google Maps API:', err);
        setApiError(err.message);
      });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !geocoderRef.current) return;

    const initializeMap = (center) => {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // Initialize Autocomplete
      if (showSearchBox && searchInputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          { types: ['establishment', 'geocode'] }
        );
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (!place.geometry) {
            console.warn("No details available for input:", place.name);
            return;
          }
          
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          map.setCenter(location);
          map.setZoom(17);
          updateMarker(map, location);
          
          // Parse address components
          const addressComponents = place.address_components || [];
          const getComponent = (type) =>
            addressComponents.find((c) => c.types.includes(type))?.long_name || '';
          
          onAddressChange({
            place: place.name || getComponent('establishment') ,
            city: getComponent('locality'),
            country: getComponent('country'),
          });
        });
      }

      if (center) {
        updateMarker(map, center);
        reverseGeocode(center);
      }

      const clickListener = map.addListener('click', (e) => {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        updateMarker(map, location);
        reverseGeocode(location);
      });

      return () => {
        window.google.maps.event.removeListener(clickListener);
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    };

    if (initialCoordinates) {
      initializeMap(initialCoordinates);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          initializeMap(userLoc);
        },
        (error) => {
          console.warn('Geolocation failed, using default:', error);
          initializeMap({ lat: 0, lng: 0 });
        }
      );
    } else {
      initializeMap({ lat: 0, lng: 0 });
    }
  }, [mapLoaded, initialCoordinates, showSearchBox]);

  useEffect(() => {
    if (!mapLoaded || !addressFields) return;

    const { place, city, country } = addressFields;
    if (place || city || country) {
      geocodeAddress(place, city, country);
    }
  }, [addressFields, mapLoaded]);

  const updateMarker = (map, position) => {
    const roundedLat = roundCoord(position.lat);
    const roundedLng = roundCoord(position.lng);

    if (markerRef.current) {
      const currentPos = markerRef.current.getPosition();
      const currentLat = roundCoord(currentPos.lat());
      const currentLng = roundCoord(currentPos.lng());

      if (roundedLat === currentLat && roundedLng === currentLng) {
        return;
      }

      markerRef.current.setPosition({ lat: roundedLat, lng: roundedLng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        map,
        position: { lat: roundedLat, lng: roundedLng },
        draggable: true,
      });

      markerRef.current.addListener('dragend', (e) => {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        reverseGeocode(location);
      });
    }

    onLocationSelect({ lat: roundedLat, lng: roundedLng });
  };

  const geocodeAddress = (place, city, country) => {
    const address = [place, city, country].filter(Boolean).join(', ');
    if (!address) return;

    geocoderRef.current.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const position = {
          lat: roundCoord(location.lat()),
          lng: roundCoord(location.lng()),
        };

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(position);
          mapInstanceRef.current.setZoom(16);
        }

        updateMarker(mapInstanceRef.current, position);
        parseAddressComponents(results[0].address_components);
      } else {
        console.warn('Geocode failed:', status);
      }
    });
  };

  const reverseGeocode = (location) => {
    geocoderRef.current.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        parseAddressComponents(results[0].address_components);
        fetchPlaceName(location);
      } else {
        console.warn('Reverse geocode failed:', status);
      }
    });
  };

  const fetchPlaceName = (location) => {
    if (!window.google || !mapInstanceRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    const request = {
      location,
      radius: 50,
      type: ['point_of_interest', 'establishment'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const placeName = results[0].name || '';
        onAddressChange((prev) => ({
          ...prev,
          place: placeName || prev.place,
        }));
      }
    });
  };

  const parseAddressComponents = (components) => {
    const getComponent = (type) =>
      components.find((c) => c.types.includes(type))?.long_name || '';

    onAddressChange({
      place: getComponent('establishment'),
      city: getComponent('locality') ,
      country: getComponent('country'),
    });
  };

  if (apiError) {
    return (
      <div style={{ color: 'red', padding: '20px', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p>Error loading map: {apiError}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            marginTop: '10px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
      }}
    >
      {/* {mapLoaded && showSearchBox && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          width: '80%',
        }}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for places..."
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '100%',
              height: '40px',
              padding: '0 12px',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      )} */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
        }}
      >
        {!mapLoaded && <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>Loading map...</div>}
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  initialCoordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  addressFields: PropTypes.shape({
    place: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
  }),
};

MapComponent.defaultProps = {
  initialCoordinates: null,
  addressFields: null,
};

export default MapComponent;