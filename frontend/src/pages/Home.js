import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions';
import axios from 'axios';
import '../home.css';
import { Link } from 'react-router-dom';
import { samplePlaceData } from '../samplePlaceData';
import CustomRadiusSlider from '../components/CustomRadiusSlider';
import isValidKeyword from '../keywordValidation';
import { useFirebase } from '../context/firebase';

function Home({user}) {
    const firebase = useFirebase();
    const [searchAreas, setSearchAreas] = useState([]);
    const [addedSearchAreasCount, setaddedSearchAreasCount] = useState(0);
    const [radius, setRadius] = useState(0);
    const [placesResponse, setPlacesResponse] = useState([]);
    const [invalidKeyword, setInvalidKeyword] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    let overallIndex = 0;

    useEffect(() => {
        console.log('Places:', placesResponse);
    }, [placesResponse]);
    useEffect(() => {
        console.log('user in home:', user);
    }, [user]);

    useEffect(() => {
    }, [addedSearchAreasCount]);

    useEffect(() => {
        if (!user) return; // Return early if user is null
    
        // Function to fetch search areas from backend
        const fetchSearchAreas = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/last50SearchAreas/by-user/${user.uid}`);
                // Map the received data to match the structure of your searchAreas state
                const mappedData = response.data.map(area => ({
                    id: area._id,
                    user_id: area.user_id,
                    marker: { lat: area.latitude, lng: area.longitude },
                    radius: area.radius
                }));
                setSearchAreas(mappedData);
                console.log("search areas:", mappedData);
            } catch (error) {
                console.error('Error fetching search areas:', error);
            }
        };
    
        // Fetch search areas when component mounts or when user changes
        fetchSearchAreas();
    }, [user]); 

    const handleLast100Click = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/last100SearchAreas/by-user/${user.uid}`);
            const mappedData = response.data.map(area => ({
                id: area._id,
                user_id: area.user_id,
                marker: { lat: area.latitude, lng: area.longitude },
                radius: area.radius
            }));
            setSearchAreas(mappedData);
        } catch (error) {
            console.error('Error fetching last 100 search areas:', error);
        }
    };

    const handleLastAllClick = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/searchAreas/by-user/${user.uid}`);
            const mappedData = response.data.map(area => ({
                id: area._id,
                user_id: area.user_id,
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
            case 'northwest':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'northwest', radius, 1.75);
                break;
            case 'northeast':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'northeast', radius, 1.75);
                break;
            case 'southwest':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'southwest', radius, 1.75);
                break;
            case 'southeast':
                newMarker = calculateNewPositionWithFactor(lat, lng, 'southeast', radius, 1.75);
                break;
            default:
                newMarker = lastSearchArea.marker;
        }

        const updatedSearchAreas = [...searchAreas, { user_id: user.uid, marker: { lat: newMarker[0], lng: newMarker[1] }, radius }];
        setSearchAreas(updatedSearchAreas);
        setaddedSearchAreasCount(prevCount => prevCount + 1);
    };

    const handleAddSearchArea = () => {
        const user_id = user.uid;
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);
        const radius = parseFloat(document.getElementById('radius').value);
    
        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
            const isDuplicate = searchAreas.some(area => 
                area.marker.lat === latitude && 
                area.marker.lng === longitude && 
                area.radius === radius &&
                area.user_id === user_id
            );
            
            if (!isDuplicate) {
                const newSearchArea = { user_id: user_id, marker: { lat: latitude, lng: longitude }, radius: radius };
                setSearchAreas([...searchAreas, newSearchArea]);
                setaddedSearchAreasCount(prevCount => prevCount + 1);
            } else {
                console.error('Duplicate search area');
            }
        }
    };

    const handleDeleteLastArea = async () => {
        const updatedSearchAreas = [...searchAreas];
        if (updatedSearchAreas.length > 0) {
            const lastSearchArea = updatedSearchAreas.pop();
            setSearchAreas(updatedSearchAreas);
            setaddedSearchAreasCount(prevCount => prevCount - 1);
    
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
    
    const handleSaveButtonClick = async () => {
        try {
          const placesToSave = [];
      
          // Iterate over each placesObject in placesResponse
          placesResponse.forEach(placesObject => {
            // Iterate over each place in the placesObject
            placesObject.places.forEach(place => {
              const placeToSave = {
                id: place.id,
                displayName: place.displayName.text,
                internationalPhoneNumber: place.internationalPhoneNumber || '',
                formattedAddress: place.formattedAddress,
                websiteUri: place.websiteUri || '',
                googleMapsUri: place.googleMapsUri || '',
                businessStatus: place.businessStatus || '',
                rating: place.rating || 0,
                userRatingCount: place.userRatingCount || 0,
                user_id : user.uid
              };
              placesToSave.push(placeToSave);
            });
          });
      
          const response = await fetch('http://localhost:5000/api/placesNormal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ places: placesToSave })
          });
      
          if (!response.ok) {
            throw new Error('Failed to save places');
          }
      
          const data = await response.json();
          console.log('Places saved:', data);
        } catch (error) {
          console.error('Error saving places:', error);
        }
      };

    const handleMapClick = (latitude, longitude) => {
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
    };

    const handleSearchClick = async () => {
        setInvalidKeyword(false);
        setIsSearching(true); // Set isSearching to true before making the request
    
        const keywordInput = document.getElementById('keyword');
        if (!keywordInput) {
            console.error('Input field with id "keyword" not found');
            setIsSearching(false); // Set isSearching to false if the keyword input field is not found
            return;
        }
      
        const keyword = keywordInput.value;
      
        // Process the keyword input
        let keywordArray = [];
        if (keyword) {
            // Split the input by comma if it contains commas
            keywordArray = keyword.includes(',') ? keyword.split(',') : [keyword];
            // Trim whitespaces from each keyword and remove empty strings
            keywordArray = keywordArray.map(keyword => keyword.trim()).filter(Boolean);
          
            // Replace spaces with underscores for keywords with two words
            keywordArray = keywordArray.map(keyword => {
                if (keyword.includes(' ')) {
                    return keyword.replace(/\s+/g, '_');
                } else {
                    return keyword;
                }
            });
        }
      
        console.log('Keyword Array:', keywordArray);
      
        // Validate each keyword in the array
        for (const kw of keywordArray) {
            if (!isValidKeyword(kw)) {
                console.log('Invalid keyword:', kw);
                setInvalidKeyword(true);
                setIsSearching(false); // Set isSearching to false if an invalid keyword is found
                return;
            }
        }
    
        // Check if the keyword is empty
        if (!keyword.trim()) {
            console.error('Keyword is empty');
            setInvalidKeyword(true);
            setIsSearching(false); // Set isSearching to false if the keyword is empty
            return;
        }
      
        try {
            // Slice the searchAreas array to include only the recently added search areas
            console.log("added search areas count when sending request" + addedSearchAreasCount)
            if (addedSearchAreasCount === 0) {
                console.error("no added search areas");
                setIsSearching(false); // Set isSearching to false if there are no added search areas
                return;
            }
            const recentSearchAreas = searchAreas.slice(-addedSearchAreasCount);
        
            // Send the sliced array in the request
            await axios.post('http://localhost:5000/api/searchAreas', recentSearchAreas, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            console.log('Search areas sent successfully');
            console.log("kwyword array being sent" + keywordArray)
    
            console.log("recent search areas wen sending req length" + recentSearchAreas.length)
    
        
            const nearbyPlacesResponse = await axios.post(
                'http://localhost:5000/api/multiple-nearby-places',
                { searchAreas: recentSearchAreas, keywordArray },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log("nearbyplacesresponse length: " + nearbyPlacesResponse.length);
            console.log("recent search areas sent in req: " + JSON.stringify(recentSearchAreas));
            setaddedSearchAreasCount(0);
            setPlacesResponse([...placesResponse, ...nearbyPlacesResponse.data]);
        } catch (error) {
            console.error('Error sending search areas:', error);
        } finally {
            setIsSearching(false); // Set isSearching to false after the request is completed (whether successful or not)
            smoothScrollTo(0, window.innerHeight * 1.25, 800);
        }
    };

    const smoothScrollTo = (endX, endY, duration) => {
        const startX = window.scrollX;
        const startY = window.scrollY;
        const distanceX = endX - startX;
        const distanceY = endY - startY;
        const startTime = performance.now();
      
        const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
        const step = currentTime => {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime >= duration) {
            window.scrollTo(endX, endY);
            return;
          }
          const progress = easeInOutQuad(elapsedTime / duration);
          window.scrollTo(startX + distanceX * progress, startY + distanceY * progress);
          window.requestAnimationFrame(step);
        };
      
        window.requestAnimationFrame(step);
      };
    

    return (
        <>
        {isSearching && (
            <div className='overlay w-full h-screen flex items-center justify-center absolute top-0 left-0 bg-gray-100 opacity-50 z-10'>
                <div className='w-50 h-50 spinner'></div>
            </div>
        )}
        <section className='w-full flex flex-col space-y-[20vh] z-0'>
            <section className='w-full flex flex-col min-h-screen custom-shadow-2'>
                <div className="w-full">
                    <GoogleMap width={window.innerWidth} height={window.innerHeight} searchAreas={searchAreas} onMapClick={handleMapClick} />
                </div>
                <div className='absolute mx-auto h-screen w-1/4 flex custom-shadow-1'>
                    <div className='h-full w-full flex flex-col p-2 justify-center items-center bg-transparent space-y-2'>
                        <div className='h-1/3 w-full flex flex-col justify-start items-start space-y-4 px-2 py-4 custom-shadow bg-gray-50 rounded-md'>
                            <div className='flex flex-col items-start space-y-2'>
                                <p>Add search area</p>
                                <div className='flex flex-col items-center space-y-4'>
                                    <div className='flex justify-center items-center space-x-2'>
                                        <input id="latitude" className='bg-gray-800 text-gray-200 w-32 rounded text-sm p-2' type="text" placeholder="Latitude" />
                                        <input id="longitude" className='bg-gray-800 text-gray-200 w-32 rounded text-sm p-2' type="text" placeholder="Longitude" />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-start space-y-2'>
                                <p>Search Radius</p>
                                <div className='flex flex-col items-center'>
                                    <CustomRadiusSlider setRadius={setRadius}/>
                                </div>
                            </div>
                            <div className='flex space-x-4'>
                                <button className='w-32 h-8 bg-gray-800 text-gray-200 tracking-wide text-sm rounded' onClick={handleAddSearchArea}>Add</button>
                                <button className='w-32 h-8 bg-gray-800 text-gray-200 tracking-wide text-sm rounded' onClick={handleDeleteLastArea}>Delete Last</button>
                            </div>
                        </div>
                        <div className='h-1/6 w-full flex flex-col justify-center items-start bg-gray-50 space-y-4 px-2 py-4 custom-shadow rounded-md'>
                            <div className='w-full flex flex-col space-y-2'>
                                <p>Add More in direction:</p>
                                <div className='w-fit flex flex-col cursor-pointer items-start justify-center select-none space-y-1'>
                                    <div className='flex justify-between space-x-1'>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded' onClick={() => handleDirectionClick('northwest')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4 -rotate-45' alt=''/>
                                        </div>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded' onClick={() => handleDirectionClick('north')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4' alt=''/>
                                        </div>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded' onClick={() => handleDirectionClick('northeast')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4 rotate-45' alt=''/>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-row items-center justify-between'>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded -rotate-90' onClick={() => handleDirectionClick('west')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4' alt=''/>
                                        </div>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded rotate-90' onClick={() => handleDirectionClick('east')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4' alt=''/>
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-1'>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded rotate-180' onClick={() => handleDirectionClick('southwest')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4 rotate-45' alt=''/>
                                        </div>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded rotate-180' onClick={() => handleDirectionClick('south')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4' alt=''/>
                                        </div>
                                        <div className='flex bg-gray-800 items-center justify-center p-2 rounded rotate-180' onClick={() => handleDirectionClick('southeast')}>
                                            <img src='../static/images/arrow-up.png' className='w-4 h-4 -rotate-45' alt=''/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='h-1/6 w-full flex flex-col justify-center items-start px-2 py-4 space-y-4 bg-gray-50 custom-shadow rounded-md'>
                            <p>Show Recent Search Areas :</p>
                            <div className='flex items-center space-x-2 font-semibold tracking-wide'>
                                <button className='w-10 h-8 bg-gray-800 text-gray-200 rounded text-sm' onClick={handleLast100Click}>100</button>
                                <button className='w-10 h-8 bg-gray-800 text-gray-200 rounded text-sm' onClick={handleLastAllClick}>All</button>
                            </div>
                        </div>
                        <div className='h-1/3 w-full flex flex-col justify-start items-start bg-gray-50 space-y-4 px-2 py-4 custom-shadow rounded-md'>
                            <div className='flex flex-col space-y-2'>
                                <p>Search Options</p>
                                <div className='flex flex-col justify-center items-start space-y-2'>  
                                    <input id="keyword" className='border border-black w-28 rounded text-sm p-1' type="text" placeholder="Keyword" />
                                    {invalidKeyword && (
                                        <div>
                                        <p className="font-semibold text-red-500 text-sm">Empty / Invalid keyword</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className='w-32 h-8 bg-gray-800 text-gray-200 tracking-wide text-sm rounded' onClick={handleSearchClick}>Search</button>
                        </div>
                    </div>
                </div>      
            </section>
            <section className='w-full bg-gray-100 py-10 tracking-wide custom-shadow-2'>
                <div className='mx-auto w-4/5 flex flex-col items-center min-h-[80vh] bg-white custom-shadow'>
                    <div className='flex items-center justify-center h-20 w-full'>
                        <p className='font-bold text-sm tracking-wider'>SEARCH RESULTS</p>
                    </div>
                    <div className='flex flex-col w-full space-y-3 p-4'>
                        {placesResponse.map((placesObject, index) => (
                            <div key={index} className='space-y-3'>
                                {placesObject.places.map((place) => (
                                    <div className='flex w-full p-2 border border-gray-400 border-x-0 border-t-0 bg-gray-100 rounded custom-shadow-1' key={place.id}>
                                        <div className='flex px-4 items-center'>
                                            <p>{overallIndex += 1}</p>
                                        </div>
                                        <div className='w-1/2 flex flex-col items-start'>
                                            <p className='p-2 font-semibold'>{place.displayName.text}</p>
                                            <div className='p-2 flex space-x-2 justify-center items-center text-sm'>
                                                <div className='flex justify-center items-center space-x-2'>
                                                    <img className='w-4 h-4 select-none' src='../static/images/star.png' alt=''/>
                                                    <p>{place.rating}</p>
                                                </div>
                                                <p className='text-sm' style={{ fontWeight: place.userRatingCount < 10 ? 'bold' : 'normal', color: place.userRatingCount < 10 ? 'red' : 'inherit' }}>
                                                    ({place.userRatingCount})
                                                </p> 
                                            </div>
                                            <div className='p-2 flex items-center justify-center space-x-2'>
                                                <img src='../static/images/address.svg' className='w-4 h-4 select-none' alt=''/>
                                                <p className='text-sm'>{place.formattedAddress}</p> 
                                            </div>
                                        </div>
                                        <div className='w-1/2 flex flex-col items-start text-sm'>
                                            {place.websiteUri ? (
                                                <div className='w-full flex space-x-2 justify-start items-center p-2 hover:bg-gray-200 hover:underline rounded cursor-pointer'>
                                                    <img className='w-5 h-5 select-none' src='../static/images/link.svg' alt=''/>
                                                    <a className='' href={place.websiteUri} target="_blank" rel="noopener noreferrer">
                                                        website
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className='w-full p-2 font-semibold' style={{ fontWeight: 'semibold', color: 'red' }}>No website</p>
                                            )}
                                            {place.internationalPhoneNumber ? (
                                                <div className='flex space-x-2 justify-center p-2 items-center'>
                                                    <img src='../static/images/phone.svg' className='w-5 h-5 select-none' alt=''/>
                                                    <p className='w-full rounded cursor-pointer text-center'>{place.internationalPhoneNumber}</p>
                                                </div>
                                            ) : (
                                                <p className='p-2 font-semibold' style={{ fontWeight: 'semibold', color: 'red' }}>No contact info</p>
                                            )}
                                            {place.businessStatus !== 'OPERATIONAL' && (
                                                <p className='p-2' style={{ fontWeight: 'semibold', color: 'red' }}>{place.businessStatus}</p>
                                            )}
                                            <div className='flex p-2 space-x-2 items-center justify-center'>
                                                <img className='w-5 h-5 select-none' src='../static/images/google.svg' alt=''/>
                                                <a className='hover:underline' href={place.googleMapsUri} target="_blank" rel="noopener noreferrer">{place.googleMapsUri}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='mx-auto w-4/5 flex items-center justify-end py-4'>
                    <div onClick={handleSaveButtonClick} className='flex items-center justify-center w-40 h-10 bg-gray-600 rounded cursor-pointer text-white'>
                        <p>Save results.</p>
                    </div>
                </div>
            </section>
        </section>
        </>
    );
}

export default Home;
