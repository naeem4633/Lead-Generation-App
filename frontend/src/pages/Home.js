import React from 'react';
import GoogleMap from '../components/GoogleMap';

function Home() {
    const sampleSearchAreas = [
        {marker: {lat: -34.397, lng: 150.544}, radius: 1000},
        {marker: {lat: -34.397, lng: 150.644}, radius: 1000},
        {marker: {lat: -34.397, lng: 150.744}, radius: 1000},
    ]
  return (
    <div className="flex flex-row border border-black w-fit h-screen">
        <h1 className=" text-3xl font-bold underline">
            Hello world!
        </h1>
        <div className="">
            <GoogleMap width='50%' height='50%' searchAreas={sampleSearchAreas}/>
        </div>
    </div>
  );
}

export default Home;