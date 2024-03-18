import React, { useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

function GoogleMapComponent({ google, width, height, markers }) {

  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [mapZoom, setMapZoom] = useState(8);

  // useEffect(() => {
  //   if (map) {
  //     const marker = new google.maps.Marker({
  //       position: mapCenter,
  //       map: map,
  //     });
  //   }
  // }, [map, mapCenter, google]);

  return (
    <div className=''>
      <Map
        google={google}
        zoom={mapZoom}
        initialCenter={mapCenter}
        onReady={(mapProps, map) => setMap(map)}
        style={{ width: width, height: height }}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCub7X0l9J4rMg3QkTWRhvKjv5-hh2SfQQ', // Replace with your API key
  libraries: ['places'], // Add any additional libraries needed
})(GoogleMapComponent);
