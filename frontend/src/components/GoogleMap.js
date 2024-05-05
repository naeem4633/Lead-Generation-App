import React from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';

function GoogleMap({ google, width, height, searchAreas, pastSearchAreas, onMapClick, center }) {
    
    const handleMapClick = (mapProps, map, clickEvent) => {
        onMapClick(mapProps, map, clickEvent);
    };

  return (
      <div className="">
          <Map
              google={google}
              zoom={8}
              style={{ width: width, height: height }}
              initialCenter={center}
              center={center}
              onClick={handleMapClick}
          >
              {searchAreas.map((searchArea, index) => (
                  <Marker 
                  icon={{
                    url: '../static/images/center.png',
                    scaledSize: new window.google.maps.Size(16, 16),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(8, 8),
                  }}
                  key={index} position={searchArea.marker}/>
              ))}
              {searchAreas.map((searchArea, index) => (
                  <Circle
                      key={index}
                      radius={searchArea.radius}
                      center={searchArea.marker}
                      visible={true}
                      strokeColor="#000000" 
                      strokeOpacity={0.75}
                      strokeWeight={1}
                      fillColor="#000000"
                      fillOpacity={0.25}
                  />
              ))}
              {pastSearchAreas.map((searchArea, index) => (
                  <Marker 
                  icon={{
                    url: '../static/images/center.png',
                    scaledSize: new window.google.maps.Size(16, 16),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(8, 8),
                  }}
                  key={index} position={searchArea.marker}/>
              ))}
              {pastSearchAreas.map((searchArea, index) => (
                  <Circle
                      key={index}
                      radius={searchArea.radius}
                      center={searchArea.marker}
                      visible={true}
                      strokeColor="#000000" 
                      strokeOpacity={0.75}
                      strokeWeight={1}
                      fillColor="#000000"
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
