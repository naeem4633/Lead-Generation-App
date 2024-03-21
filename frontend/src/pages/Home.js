import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions';
import axios from 'axios';

function Home() {
    const [searchAreas, setSearchAreas] = useState([]);
    const [addedSearchAreas, setAddedSearchAreas] = useState(0);
    const [placesResponse, setPlacesResponse] = useState([]);

    useEffect(() => {
    }, [addedSearchAreas]);

    useEffect(() => {
        // Function to fetch search areas from backend
        const fetchSearchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/last10SearchAreas');
                // Map the received data to match the structure of your searchAreas state
                const mappedData = response.data.map(area => ({
                    marker: { lat: area.latitude, lng: area.longitude },
                    radius: area.radius
                }));
                setSearchAreas(mappedData);
            } catch (error) {
                console.error('Error fetching search areas:', error);
            }
        };

        // Fetch search areas when component mounts
        fetchSearchAreas();
    }, []);

    const handleLast50Click = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/last50SearchAreas');
            const mappedData = response.data.map(area => ({
                marker: { lat: area.latitude, lng: area.longitude },
                radius: area.radius
            }));
            setSearchAreas(mappedData);
        } catch (error) {
            console.error('Error fetching last 50 search areas:', error);
        }
    };

    const handleLast100Click = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/last100SearchAreas');
            const mappedData = response.data.map(area => ({
                marker: { lat: area.latitude, lng: area.longitude },
                radius: area.radius
            }));
            setSearchAreas(mappedData);
        } catch (error) {
            console.error('Error fetching last 100 search areas:', error);
        }
    };

    const handleDirectionClick = (direction) => {
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
        setAddedSearchAreas(prevCount => prevCount + 1);
    };

    const handleAddSearchArea = () => {
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);
        const radius = parseFloat(document.getElementById('radius').value);

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
            const newSearchArea = { marker: { lat: latitude, lng: longitude }, radius: radius };
            setSearchAreas([...searchAreas, newSearchArea]);
            setAddedSearchAreas(prevCount => prevCount + 1);
        }
    };

    const handleDeleteLastArea = () => {
        const updatedSearchAreas = [...searchAreas];
        if (updatedSearchAreas.length > 0) {
            updatedSearchAreas.pop();
            setSearchAreas(updatedSearchAreas);
            setAddedSearchAreas(prevCount => prevCount - 1);
        } else {
            console.log("No search areas to delete.");
        }
    };

    const handleMapClick = (latitude, longitude) => {
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
    };

    const handleSearchClick = async () => {
        try {
            // Slice the searchAreas array to include only the recently added search areas
            const recentSearchAreas = searchAreas.slice(-addedSearchAreas);
            
            // Send the sliced array in the request
            await axios.post('http://localhost:5000/api/searchAreas', recentSearchAreas, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Search areas sent successfully');

            const nearbyPlacesResponse = await axios.post('http://localhost:5000/api/multiple-nearby-places', recentSearchAreas, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setPlacesResponse(nearbyPlacesResponse.data);
        } catch (error) {
            console.error('Error sending search areas:', error);
        }
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
                    <button className='w-32 h-10 bg-gray-500' onClick={handleDeleteLastArea}>Delete Last</button>
                    <button className='w-32 h-10 bg-gray-500' onClick={handleSearchClick}>Search</button>
                    <button className='w-32 h-10 bg-gray-500' onClick={handleLast50Click}>Get last 50</button>
                    <button className='w-32 h-10 bg-gray-500' onClick={handleLast100Click}>Get last 100</button>
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
