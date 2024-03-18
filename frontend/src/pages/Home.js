import React, { useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions'

function Home() {
    const loc2 = calculateNewPositionWithFactor(-34.397, 150.544, 'south', 1000, 2)
    const loc3 = calculateNewPositionWithFactor(loc2[0], loc2[1], 'east', 1000, 2)
    const loc4 = calculateNewPositionWithFactor(loc3[0], loc3[1], 'north', 1000, 2)
    const loc5 = calculateNewPositionWithFactor(loc4[0], loc4[1], 'south', 1000, 1)
    const loc6 = calculateNewPositionWithFactor(loc5[0], loc5[1], 'west', 1000, 1)
    const sampleSearchAreas = [
        {marker: {lat: -34.397, lng: 150.544}, radius: 1000},
        {marker: {lat: loc2[0], lng: loc2[1]}, radius: 1000},
        {marker: {lat: loc3[0], lng: loc3[1]}, radius: 1000},
        {marker: {lat: loc4[0], lng: loc4[1]}, radius: 1000},
        {marker: {lat: loc6[0], lng: loc6[1]}, radius: 500},
    ];

    const [searchAreas, setSearchAreas] = useState([]);

    const handleSearchAreasChange = (updatedSearchAreas) => {
        setSearchAreas(updatedSearchAreas);
    };

    return (
        <div className="flex flex-row border border-black w-fit h-screen">
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <div className="">
                <button onClick={handleSearchAreasChange}>Set Sample Search Areas</button>
                <GoogleMap width='50%' height='50%' searchAreas={sampleSearchAreas}/>
            </div>
        </div>
    );
}

export default Home;
