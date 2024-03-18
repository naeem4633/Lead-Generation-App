import React from 'react';
import {useState, useEffect} from 'react';
import GoogleMapComponent from './components/GoogleMap';

function App() {
  const [markers, setMarkers] = useState([]);
  
  const sampleMarkers = [
    { lat: -34.397, lng: 150.744 },
    { lat: -34.397, lng: 150.644 },
    { lat: -34.397, lng: 150.844 },
  ];

  return (
    <div className="flex flex-row border border-black w-fit h-screen">
      <h1 className=" text-3xl font-bold underline">
        Hello world!
      </h1>
      <div className="">
        <GoogleMapComponent width='50%' height='50%' markers={sampleMarkers}/>
      </div>
    </div>
  );
}

export default App;
