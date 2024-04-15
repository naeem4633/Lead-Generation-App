import React, { useState, useEffect } from 'react';
import GoogleMap from '../components/GoogleMap';
import calculateNewPositionWithFactor from '../helper_functions';
import axios from 'axios';
import '../home.css';
import CustomRadiusSlider from '../components/CustomRadiusSlider';
import isValidKeyword from '../keywordValidation';
import { useFirebase } from '../context/firebase';
import { supported_keyword_types } from '../supportedKeywordTypes';
import {backendUrl} from '../backendUrl';
import { useNavigate } from 'react-router-dom';

function Home({user}) {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const [searchAreas, setSearchAreas] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7306, lng: -73.9352 });
    const [addedSearchAreasCount, setaddedSearchAreasCount] = useState(0);
    const [currentSearchArea, setCurrentSearchArea] = useState({ user_id: '', marker: { lat: 0, lng: 0 }, radius: 0 })
    const [radius, setRadius] = useState(5000);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [placesResponse, setPlacesResponse] = useState([]);
    const [invalidKeyword, setInvalidKeyword] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [helpString, setHelpString] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save Results');
    const [searchAreaControlCounter, setSearchAreaControlCounter] = useState(() => {
        const storedValue = localStorage.getItem('searchAreaControlCounter');
        return storedValue ? parseInt(storedValue, 10) : 0;
    });
    const SEARCH_AREA_CONTROL_LIMIT = 5;

    let overallIndex = 0;
    const ADMIN_USER_ID='kY2Xzs6u0wXlGVraQgyswo4CrUn2';
    

    useEffect(() => {
        if (latitude === 0 && longitude === 0) {
            setHelpString("Set the radius, then click anywhere on the map to add a search area");
        } else if (latitude !== 0 && longitude !== 0){
            setHelpString('Use the arrow buttons to add more areas, and enter a place to search for');
        }else {
            setHelpString('')
        }
    }, [latitude, longitude]);

    useEffect(() => {
        localStorage.setItem('searchAreaControlCounter', searchAreaControlCounter.toString());
    }, [searchAreaControlCounter]);

    useEffect(() => {
        console.log('Places:', placesResponse);
    }, [placesResponse]);

    const handleCenterChange = (newCenter) => {
        setMapCenter(newCenter);
    };

    // useEffect(() => {
    //     console.log('user in home:', user);
    //     console.log('user fb token:', user.getIdToken());
    // }, [user]);

    //add a search area whenever the lat or lng values change, this is done after handleMapClick()
    useEffect(() => {
        if (latitude !== 0 && longitude !== 0) {
            handleAddSearchArea();
        }
    }, [latitude, longitude]);

    useEffect(() => {
        if (!user) return;

        // Function to fetch search areas from backend
        const fetchSearchAreas = async () => {
            try {
                // Get Firebase authentication token from user object
                const firebaseToken = await user.getIdToken();

                // Set headers with Firebase token
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseToken}`
                };

                const response = await axios.get(`${backendUrl}api/last50SearchAreas/by-user/${user.uid}`, {
                    headers: headers
                });
                
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
            // Get Firebase authentication token from user object
            const firebaseToken = await user.getIdToken();

            // Set headers with Firebase token
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firebaseToken}`
            };

            const response = await axios.get(`${backendUrl}api/last100SearchAreas/by-user/${user.uid}`, {
                headers: headers
            });
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
            // Get Firebase authentication token from user object
            const firebaseToken = await user.getIdToken();

            // Set headers with Firebase token
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firebaseToken}`
            };

            const response = await axios.get(`${backendUrl}api/searchAreas/by-user/${user.uid}`, {
                headers: headers
            });
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
        if (!lastSearchArea) return;
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

        const isAdmin = user.uid === ADMIN_USER_ID; 
        const isBelowMaxLimit = searchAreaControlCounter < SEARCH_AREA_CONTROL_LIMIT;

        if (isAdmin || isBelowMaxLimit) {
            const newSearchArea = { user_id: user.uid, marker: { lat: newMarker[0], lng: newMarker[1] }, radius };
            setCurrentSearchArea(newSearchArea)
            const updatedSearchAreas = [...searchAreas, newSearchArea];
            setSearchAreas(updatedSearchAreas);
            setaddedSearchAreasCount(prevCount => prevCount + 1);
            isAdmin && setSearchAreaControlCounter(0);
            !isAdmin && setSearchAreaControlCounter(prevCount => prevCount + 1);
        } else {
            console.error('Duplicate search area');
        }
    };

    const handleAddSearchArea = () => {
        if (!user) {
            console.error("User is null");
            return;
        }

        const user_id = user.uid;
        const isAdmin = user_id === ADMIN_USER_ID; 
        const isBelowMaxLimit = searchAreaControlCounter < SEARCH_AREA_CONTROL_LIMIT;
    
        if (isAdmin || isBelowMaxLimit) {
            if (latitude !== null && longitude !== null && !isNaN(radius)) {
                const isDuplicate = searchAreas.some(area => 
                    area.marker.lat === latitude && 
                    area.marker.lng === longitude && 
                    area.radius === radius &&
                    area.user_id === user_id
                );
    
                if (!isDuplicate) {
                    const newSearchArea = { user_id: user_id, marker: { lat: latitude, lng: longitude }, radius: radius };
                    setCurrentSearchArea(newSearchArea);
                    setSearchAreas([...searchAreas, newSearchArea]);
                    setaddedSearchAreasCount(prevCount => prevCount + 1);
                    isAdmin && setSearchAreaControlCounter(0);
                    !isAdmin && setSearchAreaControlCounter(prevCount => prevCount + 1);
                } else {
                    console.error('Duplicate search area');
                }
            }
        } else {
            console.error('Maximum search area limit reached');
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
                    await axios.delete(`${backendUrl}api/searchAreas/${lastSearchArea.id}`);
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
        if (user.isAnonymous){
            setSaveButtonText('Unable to save on Guest Login');
            return;
        }
        setSaveButtonText('Saving...');
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
      
          const response = await fetch(`${backendUrl}api/placesNormal`, {
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
          setSaveButtonText('Save Results')
          navigate('/saved-places');
        } catch (error) {
          console.error('Error saving places:', error);
        }
      };

      const handleMapClick = (mapProps, map, clickEvent) => {
        const { latLng } = clickEvent;
        const lat = parseFloat(latLng.lat().toFixed(4));
        const lng = parseFloat(latLng.lng().toFixed(4));
        setLatitude(lat);
        setLongitude(lng);
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
                setIsSearching(false);
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
            await axios.post(`${backendUrl}api/searchAreas`, recentSearchAreas, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            console.log('Search areas sent successfully');
            console.log("kwyword array being sent" + keywordArray)
    
            console.log("recent search areas wen sending req length" + recentSearchAreas.length)
    
        
            const nearbyPlacesResponse = await axios.post(
                `${backendUrl}api/multiple-nearby-places`,
                { searchAreas: recentSearchAreas, keywordArray },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log("recent search areas sent in req: " + JSON.stringify(recentSearchAreas));
            console.log("nearbyplacesresponse : " , nearbyPlacesResponse);
            console.log("nearbyplacesresponse length: " , nearbyPlacesResponse.data.nearbyPlaces.length);
            console.log("searcharearesponse counts length: " , nearbyPlacesResponse.data.searchAreaResponseCounts.length);
            setaddedSearchAreasCount(0);
            setPlacesResponse([...placesResponse, ...nearbyPlacesResponse.data.nearbyPlaces]);

            //send the seearch area response count objects back to the relevant path for storage
            try {
                const searchAreaResponseCounts = nearbyPlacesResponse.data.searchAreaResponseCounts;
                await axios.post(`${backendUrl}api/searchAreaResponseCounts`, searchAreaResponseCounts, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Search area response counts sent successfully.');
            } catch (error) {
                console.error('Error sending search area response counts:', error);
            }
        } catch (error) {
            console.error('Error sending search areas:', error);
        } finally {
            setIsSearching(false); // Set isSearching to false after the request is completed (whether successful or not)
            smoothScrollTo(0, window.innerHeight * 1.25, 800);
        }
    };

    const handleLogoutClick = async () => {
        try {
            await firebase.getAuth().signOut();
            console.log("User signed out successfully");
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleKeywordChange = (event) => {
        const userInput = event.target.value.toLowerCase();
        const filtered = Object.keys(supported_keyword_types).reduce((acc, category) => {
            const options = supported_keyword_types[category].filter(option =>
                option.includes(userInput)
            );
            return [...acc, ...options];
        }, []);
        setKeyword(userInput);
        setFilteredOptions(filtered);
    };

    const handleSuggestionClick = (option) => {
        setKeyword(option);
        setFilteredOptions([]);
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
                <div className='spinner'></div>
            </div>
        )}
        <section className='w-full flex flex-col space-y-[20vh] z-0'>
            <section className='text-xs 2xl:text-sm w-full flex flex-col min-h-screen custom-shadow-2'>
                <div className="w-full">
                    <GoogleMap width="100%" height="100%" searchAreas={searchAreas} onMapClick={handleMapClick} center={mapCenter} />
                </div>
                <div className='w-3/4 flex flex-col absolute top-0 right-0 select-none space-y-1'>
                    {user && <div className='w-full flex justify-between items-center p-1 custom-shadow-1 bg-gray-800'>
                        {searchAreaControlCounter < SEARCH_AREA_CONTROL_LIMIT && helpString && helpString.length > 0 && (<div className='w-full rounded p-2 tracking-wider font-light'>
                            <div className='flex flex-row justify-start items-center space-x-4 text-white'>
                                <p>{helpString}</p>
                            </div>
                        </div>)}
                        {searchAreaControlCounter >= SEARCH_AREA_CONTROL_LIMIT && (<div className='absolute bg-gray-800 w-3/4 rounded p-2 tracking-wider font-light'>
                            <div className='flex flex-col justify-start items-start space-y-2 text-white'>
                                <p className='font-semibold'>Demo Project | Search Area Limit Reached</p>
                                <p className='text-xs'>Contact the Administrator for more info</p>
                            </div>
                        </div>)}
                        <div className='w-full rounded p-2'>
                            <div className='flex flex-row justify-end items-center space-x-4 text-white'>
                                {!user.isAnonymous && (<img src={user.photoURL} className='w-8 h-8 rounded-full' alt='' />)}
                                <p>{user.displayName || user.email}</p>
                                {user.isAnonymous && (<p>Guest</p>)}
                                <div onClick={handleLogoutClick} className=' hover:bg-gray-600 p-2 rounded cursor-pointer transition-all duration-200'>
                                    <img src='../static/images/logout.png' className='w-5 h-5' alt=''/>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className='w-full flex justify-evenly z-10 p-2 text-xs'>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-3 py-1 px-2' onClick={() => handleCenterChange({ lat: 40.7306, lng: -73.9352 })}>
                            New York City, United States
                        </button>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-1 py-1 px-2' onClick={() => handleCenterChange({ lat: 51.5072, lng: 0.1276 })}>
                            London, United Kingdom
                        </button>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-1 py-1 px-2' onClick={() => handleCenterChange({ lat: 41.0082, lng: 28.9784 })}>
                            Istanbul, Turkey
                        </button>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-1 py-1 px-2' onClick={() => handleCenterChange({ lat: -33.8651, lng: 151.2099 })}>
                            Sydney, Austrailia
                        </button>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-1 py-1 px-2' onClick={() => handleCenterChange({ lat: -23.5577, lng: -46.6392 })}>
                            São Paulo, Brazil
                        </button>
                        <button className='bg-white hover:bg-gray-800 hover:text-gray-100 transition-all duration-200 custom-shadow-1 py-1 px-2' onClick={() => handleCenterChange({ lat: 35.6895, lng: 139.6917 })}>
                            Tokyo, Japan
                        </button>
                    </div>
                </div>
                
                <div className='absolute mx-auto h-screen w-1/4 flex custom-shadow-1'>
                    <div className='h-full w-full flex flex-col p-2 justify-center items-center bg-transparent space-y-2'>
                        <div className='h-2/5 2xl:h-1/3 w-full flex flex-col justify-start items-start space-y-2 2xl:space-y-4 p-2 custom-shadow bg-gray-50 rounded-md'>
                            <div className='flex flex-col items-start space-y-1 2xl:space-y-2'>
                                <p className='font-semibold text-xs 2xl:text-sm tracking-wide'>ADD SEARCH AREA</p>
                                <div className='flex flex-col items-center space-y-4'>
                                    <div className='flex justify-center items-center space-x-4 text-xs'>
                                        <div className='flex flex-col space-y-1'>
                                            <label className='tracking-wider font-semibold'>LAT</label>
                                            <input id="latitude" className='bg-gray-800 text-white w-20 py-1 px-2 2xl:p-2 custom-shadow-3' type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <label className='tracking-wider font-semibold'>LONG</label>
                                            <input id="longitude" className='bg-gray-800 text-white w-20 py-1 px-2 2xl:p-2 custom-shadow-3' type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-start space-y-1 2xl:space-y-2'>
                                <p className='font-semibold text-xs 2xl:text-sm tracking-wide'>RADIUS</p>
                                <div className='flex flex-col items-center'>
                                    <CustomRadiusSlider setRadius={setRadius}/>
                                </div>
                            </div>
                            <div className='flex space-x-4 text-xs w-full items-center cursor-default select-none'>
                                <div className='flex items-center justify-center space-x-2 custom-shadow-1 p-1'>
                                    <img className='w-4 h-4' src='../static/images/pin.png' alt=''/>
                                    <p className='text-black'>{currentSearchArea.marker.lat.toFixed(2)}</p>
                                    <p className='text-black'>{currentSearchArea.marker.lng.toFixed(2)}</p>
                                </div>
                                <div className='flex space-x-2 items-center custom-shadow-1 p-1'>
                                    <img className='w-4 h-4' src='../static/images/radius.png'alt=''/>
                                    <p className='text-black'>{currentSearchArea.radius}</p>
                                </div>
                                <div className='cursor-pointer hover:bg-gray-200 custom-shadow-1 p-1' onClick={handleDeleteLastArea}>
                                    <img className='w-5 h-5' src='../static/images/trash.png' alt=''/>
                                </div>
                            </div>
                        </div>
                        <div className='flx-grow 2xl:h-1/6 w-full flex flex-col justify-center items-start bg-gray-50 space-y-4 px-2 py-2 2xl:py-4 custom-shadow rounded-md'>
                            <div className='w-full flex flex-col space-y-2'>
                                <p className='font-semibold text-xs 2xl:text-sm tracking-wide'>ADD MORE AREAS</p>
                                <div className='w-fit flex flex-col cursor-pointer items-start justify-center select-none space-y-1'>
                                    <div className='flex justify-between space-x-1'>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1' onClick={() => handleDirectionClick('northwest')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white -rotate-45">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1' onClick={() => handleDirectionClick('north')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1' onClick={() => handleDirectionClick('northeast')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white rotate-45">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-row items-center justify-between'>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1' onClick={() => handleDirectionClick('west')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white -rotate-90">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1' onClick={() => handleDirectionClick('east')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white rotate-90">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-1'>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1 rotate-180' onClick={() => handleDirectionClick('southwest')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white  rotate-45">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1 rotate-180' onClick={() => handleDirectionClick('south')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className='flex border hover:bg-gray-800 rounded-full items-center justify-center custom-shadow-1 transition-all duration-100 font-semibold p-1 rotate-180' onClick={() => handleDirectionClick('southeast')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:fill-white -rotate-45">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='h-fit 2xl:h-1/6 w-full flex flex-col justify-start items-start px-2 py-4 space-y-4 bg-gray-50 custom-shadow rounded-md  text-xs 2xl:text-sm'>
                            <p className='font-semibold tracking-wide'>SHOW RECENT AREAS</p>
                            <div className='flex items-center space-x-2 font-semibold tracking-wide'>
                                <button className='w-10 text-black tracking-wide transition-all duration-300 custom-shadow-1 p-1 hover:bg-gray-800 hover:text-white select-none' onClick={handleLast100Click}>100</button>
                                <button className='w-10 text-black tracking-wide transition-all duration-300 custom-shadow-1 p-1 hover:bg-gray-800 hover:text-white select-none' onClick={handleLastAllClick}>All</button>
                            </div>
                        </div>
                        <div className='h-1/4 2xl:h-1/3 w-full flex flex-col justify-start items-start bg-gray-50 space-y-8 px-2 py-4 custom-shadow rounded-md'>
                            <div className='flex flex-col space-y-2'>
                                <p className='font-semibold text-x 2xl:text-sm tracking-wide'>SEARCH OPTIONS</p>
                                <div className='flex flex-col justify-center items-start space-y-2'>  
                                    <div className='relative flex flex-col'>
                                        <input
                                            id="keyword"
                                            className='bg-gray-800 text-white w-32 text-xs p-1 2xl:p-2 custom-shadow-3'
                                            type="text"
                                            placeholder="Place Keyword"
                                            autoComplete="off"
                                            value={keyword}
                                            onChange={handleKeywordChange}
                                        />
                                        {filteredOptions.length > 0 && (
                                            <div className='absolute top-7 bg-white mt-1 rounded-md custom-shadow-2 text-xs tracking-wide text-gray-800'>
                                                <p className="font-semibold text-xs py-1 px-2 text-black">Suggestions</p>
                                                <ul className="overflow-y-auto max-h-12 2xl:max-h-20 scrollbar scrollbar-thumb-gray-800">
                                                    {filteredOptions.map((option, index) => (
                                                        <li  key={index} className="py-1 px-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(option)}>{option}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {invalidKeyword && (
                                        <div>
                                        <p className="font-semibold text-red-500 text-sm">Empty / Invalid keyword</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className='w-32 p-1 2xl:p-2 hover:bg-gray-800 hover:text-white text-black tracking-wide text-xs 2xl:text-sm transition-all duration-100 custom-shadow-1 select-none' onClick={handleSearchClick}>Search</button>
                        </div>
                    </div>
                </div>      
            </section>
            {placesResponse.length > 0 && <section className='w-full bg-white py-10 tracking-wide custom-shadow-2'>
                <div className='mx-auto w-4/5 flex flex-col items-center min-h-[80vh]'>
                    <div className='flex items-center justify-center h-20 w-full'>
                        <p className='font-bold text-sm tracking-wider'>SEARCH RESULTS</p>
                    </div>
                    <div className='flex flex-col w-full space-y-3 p-4'>
                        {placesResponse.map((placesObject, index) => (
                            <div key={index} className='space-y-3'>
                                {placesObject.places.map((place) => (
                                    <div className='flex w-full p-2 border border-x-0 border-t-0 bg-gray-100 rounded custom-shadow-1' key={place.id}>
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
                                                    <img className='w-5 h-5 select-none' src='../static/images/globe.png' alt=''/>
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
                    <div onClick={handleSaveButtonClick} className='flex items-center justify-center w-fit h-10 px-8 bg-gray-600 rounded cursor-pointer text-white'>
                        <p>{saveButtonText}</p>
                    </div>
                </div>
            </section>}
        </section>
        </>
    );
}

export default Home;
