import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';

function GoogleMap({ google, width, height, searchAreas }) {
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [mapZoom, setMapZoom] = useState(8);


  return (
    <div className=''>
      <Map
        google={google}
        zoom={mapZoom}
        initialCenter={mapCenter}
        onReady={(mapProps, map) => setMap(map)}
        style={{ width: width, height: height }}
      >
        {map && searchAreas.map((searchArea, index) => (
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
