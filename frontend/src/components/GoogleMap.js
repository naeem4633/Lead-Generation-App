import React from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';

function GoogleMap({ google, width, height, searchAreas, onMapClick }) {
    
    const handleMapClick = (mapProps, map, clickEvent) => {
        onMapClick(mapProps, map, clickEvent);
    };

  return (
      <div className="">
          <Map
              google={google}
              zoom={10}
              style={{ width: width, height: height }}
              onClick={handleMapClick}
          >
              {/* {searchAreas.map((searchArea, index) => (
                  <Marker key={index} position={searchArea.marker} />
              ))} */}
              {searchAreas.map((searchArea, index) => (
                  <Circle
                      key={index}
                      radius={searchArea.radius}
                      center={searchArea.marker}
                      visible={true}
                      strokeColor="#0000FF" 
                      strokeOpacity={0.5}
                      strokeWeight={2}
                      fillColor="#0000FF"
                      fillOpacity={0.25}
                  />
              ))}
          </Map>
      </div>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
})(GoogleMap);
