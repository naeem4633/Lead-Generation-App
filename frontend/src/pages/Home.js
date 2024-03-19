import React, { useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions';

function Home() {
    const [searchAreas, setSearchAreas] = useState([{ marker: { lat: -34.397, lng: 150.544 }, radius: 1000 }]);

    const handleDirectionClick = (direction) => {
        console.log('clicked')
        const lastSearchArea = searchAreas[searchAreas.length - 1];
        const { lat, lng } = lastSearchArea.marker;
        const { radius } = lastSearchArea;
        let newMarker;

        switch (direction) {
            case 'north':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'north', radius, 2);
                break;
            case 'south':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'south', radius, 2);
                break;
            case 'east':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'east', radius, 2);
                break;
            case 'west':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'west', radius, 2);
                break;
            default:
                newMarker = lastSearchArea.marker;
        }

        const updatedSearchAreas = [...searchAreas, { marker: { lat: newMarker[0], lng: newMarker[1] }, radius }];
        setSearchAreas(updatedSearchAreas);
        console.log(searchAreas)
    };

    const handleAddSearchArea = () => {
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);
        const radius = parseFloat(document.getElementById('radius').value);

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
            const newSearchArea = { marker: { lat: latitude, lng: longitude }, radius: radius };
            setSearchAreas([...searchAreas, newSearchArea]);
        }
    };

    const handleMapClick = (latitude, longitude) => {
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
    };

    return (
        <>
        <div className='mx-auto w-3/4 flex flex-col border border-black justify-center items-center'>
            <div className='flex'>
                <div className='flex flex-col justify-center items-center border border-black space-y-2'>
                    <p>Add search area</p>
                    <div className='flex'>  
                        <input id="latitude" className='border border-black' type="text" placeholder="Latitude" />
                        <input id="longitude" className='border border-black' type="text" placeholder="Longitude" />
                        <input id="radius" className='border border-black' type="text" placeholder="Radius" />
                    </div>
                    <button className='w-32 h-10 bg-gray-500' onClick={handleAddSearchArea}>Add</button>
                </div>

                <div className='w-60 flex flex-col cursor-pointer items-center select-none'>
                    <div className='flex w-16 h-16 border border-black items-center justify-center' onClick={() => handleDirectionClick('north')}>
                        <p>North</p>
                    </div>
                    <div className='w-4/5 flex flex-row items-center justify-between'>
                        <div className='flex w-16 h-16 border border-black items-center justify-center' onClick={() => handleDirectionClick('west')}>
                            <p>West</p>
                        </div>
                        <div className='flex w-16 h-16 items-center justify-center' onClick={() => handleDirectionClick('south')}>
                            <p>South</p>
                        </div>
                        <div className='flex w-16 h-16 border border-black items-center justify-center' onClick={() => handleDirectionClick('east')}>
                            <p>East</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto w-full flex flex-row border border-black">
                <div className="w-[800px] h-[501px] border border-black">
                    <GoogleMap width="1000px" height="500px" searchAreas={searchAreas} onMapClick={handleMapClick} />
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;
