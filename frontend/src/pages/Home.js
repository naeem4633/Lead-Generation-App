import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { samplePlaceData } from '../samplePlaceData';
import { Navigate } from 'react-router-dom';

function Home() {
    const [searchAreas, setSearchAreas] = useState([]);
    const [addedSearchAreas, setAddedSearchAreas] = useState(0);
    const [placesResponse, setPlacesResponse] = useState([]);

    let overallIndex = 0;

    useEffect(() => {
        console.log('Places:', placesResponse);
    }, [placesResponse]);

    useEffect(() => {
    }, [addedSearchAreas]);

    useEffect(() => {
        // Function to fetch search areas from backend
        const fetchSearchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/last10SearchAreas');
                // Map the received data to match the structure of your searchAreas state
                const mappedData = response.data.map(area => ({
                    id: area._id,
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
                id: area._id,
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
                id: area._id,
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

    const handleDeleteLastArea = async () => {
        const updatedSearchAreas = [...searchAreas];
        if (updatedSearchAreas.length > 0) {
            const lastSearchArea = updatedSearchAreas.pop();
            setSearchAreas(updatedSearchAreas);
            setAddedSearchAreas(prevCount => prevCount - 1);
    
            // Check if the lastSearchArea has an ID
            if (lastSearchArea && lastSearchArea.id) {
                // Send DELETE request to delete the last search area
                try {
                    await axios.delete(`http://localhost:5000/api/searchAreas/${lastSearchArea.id}`);
                    console.log('Last search area deleted successfully.');
                } catch (error) {
                    console.error('Error deleting last search area:', error);
                }
            } else {
                console.log('Skipping DELETE request: Last search area ID does not exist.');
            }
        } else {
            console.log("No search areas to delete.");
        }
    };
    

    const handleMapClick = (latitude, longitude) => {
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
    };

    const handleSearchClick = async () => {
        setPlacesResponse(samplePlaceData);
        // try {
        //     // Slice the searchAreas array to include only the recently added search areas
        //     const recentSearchAreas = searchAreas.slice(-addedSearchAreas);
            
        //     // Send the sliced array in the request
        //     await axios.post('http://localhost:5000/api/searchAreas', recentSearchAreas, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
            
        //     console.log('Search areas sent successfully');

        //     const nearbyPlacesResponse = await axios.post('http://localhost:5000/api/multiple-nearby-places', recentSearchAreas, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     console.log("nearbyplacsreposnse: "+ nearbyPlacesResponse.data)
        //     setPlacesResponse(nearbyPlacesResponse.data);
        // } catch (error) {
        //     console.error('Error sending search areas:', error);
        // }
    };

    return (
        <>
        <div className='w-full flex flex-col min-h-screen'>
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
                        <button className='flex justify-center items-center w-32 h-10 bg-gray-500' onClick={handleSearchClick}>Search</button>
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
            </div>
            <div className="mx-auto w-full flex flex-row">
                <div className="w-full h-[750px]">
                    <GoogleMap className='w-full' height={'750px'} searchAreas={searchAreas} onMapClick={handleMapClick} />
                </div>
            </div>
        </div>
        <section className='w-full min-h-screen'>
        <div className='mx-auto w-3/4 flex flex-col border border-black items-center min-h-[80vh]'>
            <div className='flex items-center justify-center h-20 w-full border border-black'>
                <p>Search Results</p>
            </div>
            <div className='flex flex-col w-full space-y-2'>
                {placesResponse.map((placesObject, index) => (
                    <div key={index}>
                        {placesObject.places.map((place) => (
                            <div className='flex w-full p-2 border border-gray-400 border-x-0 border-t-0' key={place.id}>
                                <div className='flex px-4 items-center'>
                                    <p>{overallIndex += 1}</p>
                                </div>
                                <div className='w-1/2 flex flex-col items-start'>
                                    <p className='p-2 font-semibold'>{place.displayName.text}</p>
                                    <div className='p-2 flex space-x-2 justify-center items-center text-sm'>
                                        <div className='flex justify-center items-center space-x-2'>
                                            <img className='w-4 h-4 select-none' src='../static/images/star.png'></img>
                                            <p>{place.rating}</p>
                                        </div>
                                        <p className='text-sm' style={{ fontWeight: place.userRatingCount < 10 ? 'bold' : 'normal', color: place.userRatingCount < 10 ? 'red' : 'inherit' }}>
                                            ({place.userRatingCount})
                                        </p> 
                                    </div>
                                    <div className='p-2 flex items-center justify-center space-x-2'>
                                        <img src='../static/images/address.svg' className='w-4 h-4 select-none'></img>
                                        <p className='text-sm'>{place.formattedAddress}</p> 
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col items-start text-sm'>
                                    {place.websiteUri ? (
                                        <div className='w-full flex space-x-2 justify-start items-center p-2 hover:bg-gray-200 hover:underline rounded cursor-pointer'>
                                            <img className='w-5 h-5 select-none' src='../static/images/link.svg'></img>
                                            <a className='' href={place.websiteUri} target="_blank" rel="noopener noreferrer">
                                                website
                                            </a>
                                        </div>
                                    ) : (
                                        <p className='w-full p-2 font-semibold' style={{ fontWeight: 'semibold', color: 'red' }}>No website</p>
                                    )}
                                    {place.internationalPhoneNumber ? (
                                        <div className='flex space-x-2 justify-center p-2 items-center'>
                                            <img src='../static/images/phone.svg' className='w-5 h-5 select-none'></img>
                                            <p className='w-full rounded cursor-pointer text-center'>{place.internationalPhoneNumber}</p>
                                        </div>
                                    ) : (
                                        <p className='p-2' style={{ fontWeight: 'semibold', color: 'red' }}>No contact info</p>
                                    )}
                                    {place.businessStatus !== 'OPERATIONAL' && (
                                        <p className='p-2' style={{ fontWeight: 'semibold', color: 'red' }}>{place.businessStatus}</p>
                                    )}
                                    <div className='flex p-2 space-x-2 items-center justify-center'>
                                        <img className='w-5 h-5 select-none' src='../static/images/google.svg'></img>
                                        <a className='hover:underline' href={place.googleMapsUri} target="_blank" rel="noopener noreferrer">{place.googleMapsUri}</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </section>
        </>
    );
}

export default Home;
