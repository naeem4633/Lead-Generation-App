import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';

function GoogleMap({ google, width, height, searchAreas, onMapClick }) {
  const handleMapClick = (mapProps, map, clickEvent) => {
      const { latLng } = clickEvent;
      const latitude = latLng.lat().toFixed(4);
      const longitude = latLng.lng().toFixed(4);
      onMapClick(latitude, longitude);
  };

  return (
      <div className="">
          <Map
              google={google}
              zoom={8}
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
  apiKey: 'AIzaSyCub7X0l9J4rMg3QkTWRhvKjv5-hh2SfQQ',
  libraries: ['places'],
})(GoogleMap);
