import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFirebase } from '../context/firebase';
import '../savedPlaces.css'; 
import { backendUrl } from '../backendUrl';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const SavedPlaces = ({savedPlaces, setSavedPlaces, user}) => {
    let overallIndex = 0;
    const navigate = useNavigate();
    const firebase = useFirebase();
    const [checkedItems, setCheckedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulating loading data
    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleCheckboxChange = (event, id) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setCheckedItems([...checkedItems, id]);
            console.log("checkedItems", checkedItems)
        } else {
            const updatedItems = checkedItems.filter(itemId => itemId !== id);
            setCheckedItems(updatedItems);
        }
    };

    useEffect(() => {
        // Delay the execution of the function by 1 second
        const timeoutId = setTimeout(() => {
            if (savedPlaces.length > 0) {
                const firstItemId = savedPlaces[0].id;
                
                // Check the first item in the list
                setCheckedItems([firstItemId]);
        
                // Uncheck the first item after 1 second
                setTimeout(() => {
                    setCheckedItems([]);
                }, 1000);
            }
        }, 500);
    
        return () => clearTimeout(timeoutId);
    }, [savedPlaces]);

    const handleConvertToLeads = async () => {
        try {
            // Map checked items to lead objects
            const leads = checkedItems.map(item => ({
                place: item,
                user_id: user.uid,
            }));

            // Send POST request to convert checked items to leads
            await axios.post(`${backendUrl}api/leads`, leads);

            // Clear checked items after conversion and deletion
            setCheckedItems([]);

            // Handle response if necessary
            console.log('Conversion to leads successful');
            navigate('/leads');
        } catch (error) {
            console.error('Error converting to leads:', error);
        }
    };

    // Function to handle creating a new lead with a design issue
    const handleDesignIssueClick = async (place) => {
        try {
            // Create a new lead object with the issue set to "Design"
            const lead = {
                place: place._id,
                user_id: user.uid,
                issue: 'Design'
            };
    
            // Update the savedPlaces state to reflect the change
            const updatedSavedPlaces = savedPlaces.map(savedPlace => {
                if (savedPlace._id === place._id) {
                    return { ...savedPlace, isLead: true };
                }
                return savedPlace;
            });
            setSavedPlaces(updatedSavedPlaces);

            // Send POST request to create the lead
            await axios.post(`${backendUrl}api/lead`, lead);
    
            // Update the place to set isLead to true
            await axios.put(`${backendUrl}api/places/${place.id}`, { isLead: true });
    
            // Handle response if necessary
            console.log('Lead with design issue created successfully');
            // navigate('/leads');
        } catch (error) {
            console.error('Error creating lead with design issue:', error);
        }
    };
    
    // Function to handle creating a new lead with a SEO issue
    const handleSeoIssueClick = async (place) => {
        try {
            // Create a new lead object with the issue set to "SEO"
            const lead = {
                place: place._id,
                user_id: user.uid,
                issue: 'SEO'
            };
    
            // Send POST request to create the lead
            await axios.post(`${backendUrl}api/lead`, lead);
    
            // Update the place to set isLead to true
            await axios.put(`${backendUrl}api/places/${place.id}`, { isLead: true });
    
            // Update the savedPlaces state to reflect the change
            const updatedSavedPlaces = savedPlaces.map(savedPlace => {
                if (savedPlace._id === place._id) {
                    return { ...savedPlace, isLead: true };
                }
                return savedPlace;
            });
            setSavedPlaces(updatedSavedPlaces);
    
            // Handle response if necessary
            console.log('Lead with SEO issue created successfully');
            // navigate('/leads');
        } catch (error) {
            console.error('Error creating lead with SEO issue:', error);
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

    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`${backendUrl}api/places/${id}`);
            if (response.status === 200) {
                const updatedSavedPlaces = savedPlaces.filter(place => place.id !== id);
                setSavedPlaces(updatedSavedPlaces);
                console.log(`Place with ID ${id} deleted successfully`);
            } else {
                console.error('Failed to delete place');
            }
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

  return (
    <section className='w-full min-h-screen bg-gray-100 py-10 tracking-wide'>
        {user && <div className='absolute top-0 right-0 p-1 custom-shadow-1 bg-gray-800'>
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
        <div className='mx-auto w-4/5 flex flex-col items-center min-h-[80vh] bg-white custom-shadow'>
            <div className='flex items-center justify-center h-20 w-full'>
                <p className='font-bold text-sm tracking-wider'>SAVED PLACES</p>
            </div>
            {!savedPlaces.length == 0 && (<button className='h-8 border border-gray-300 hover:border-gray-900 text-black tracking-wide text-xs rounded transition-all duration-300 font-semibold px-4' onClick={handleConvertToLeads}>Convert Selected to leads</button>)}
            <div className='flex flex-col w-full space-y-3 p-4'>
                {isLoading && savedPlaces.length == 0 && (<Spinner/>)}
                {!isLoading && savedPlaces.length == 0 && (<p className='w-full text-xs tracking-wider text-center'>No Places to display. Perform a search to save places.</p>)}
                {savedPlaces.map((place, index) => (
                    <div key={index} className={`space-y-3 ${place.isLead ? 'bg-green-100' : 'bg-white'}`}>
                        <div className='flex w-full custom-shadow-1 p-2 py-4' key={place.id}>
                            <div className='flex px-4 items-start'>
                                <div className='flex flex-col items-center space-y-2'>
                                    <p>{overallIndex += 1}</p>
                                    <label className="container">
                                        <input
                                            type="checkbox"
                                            checked={checkedItems.includes(place._id)}
                                            onChange={(event) => handleCheckboxChange(event, place._id)}
                                        />
                                        <div className="checkmark">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                                <title>Checkmark</title>
                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M416 128L192 384l-96-96"></path>
                                            </svg>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className='w-1/2 flex flex-col items-start space-y-3'>
                                <p className='font-semibold'>{place.displayName}</p>
                                <div className='flex space-x-1 justify-center items-center text-xs'>
                                    <div className='flex justify-center items-center space-x-2 pl-1'>
                                        <img className='w-4 h-4 select-none' src='../static/images/star.png' alt=''/>
                                        <p className='font-semibold'>{place.rating}</p>
                                    </div>
                                    <p className='text-xs' style={{ fontWeight: place.userRatingCount < 10 ? 'bold' : 'normal', color: place.userRatingCount < 10 ? 'red' : 'inherit' }}>
                                        ({place.userRatingCount})
                                    </p> 
                                </div>
                                {place.websiteUri ? (
                                    <div className='w-full flex space-x-2 justify-start items-center rounded cursor-pointer text-xs'>
                                        <div className='w-3/4 flex space-x-2 justify-start items-center p-1'>
                                            <a href={place.websiteUri} target="_blank" rel="noopener noreferrer" className='w-fit'>
                                                <img className='w-4 select-none' src='../static/images/globe.png' alt=''/>
                                            </a>
                                            <a className='whitespace-nowrap overflow-hidden overflow-ellipsis w-[500px]' href={place.websiteUri} target="_blank" rel="noopener noreferrer">
                                                {place.websiteUri}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <p className='w-full font-semibold text-xs' style={{ fontWeight: 'semibold', color: 'red' }}>No website</p>
                                )}
                            </div>
                            <div className='w-1/2 flex flex-col items-start text-xs space-y-2'>
                                <div className='flex items-center justify-center space-x-1'>
                                    <a href={place.googleMapsUri} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center p-1 rounded hover:bg-gray-200'>
                                        <img className='w-5 h-5 select-none' src='../static/images/google.svg' alt=''/>
                                    </a>
                                    <p className='text-xs'>{place.formattedAddress}</p> 
                                </div>
                                {place.internationalPhoneNumber ? (
                                    <div className='flex space-x-2 justify-center pl-1 items-center'>
                                        <img src='../static/images/phone.svg' className='w-5 h-5 select-none' alt=''/>
                                        <p className='w-full rounded text-center'>{place.internationalPhoneNumber}</p>
                                    </div>
                                ) : (
                                    <p className='font-semibold pl-1' style={{ fontWeight: 'semibold', color: 'red' }}>No contact info</p>
                                )}
                                {place.businessStatus !== 'OPERATIONAL' && (
                                    <p className='' style={{ fontWeight: 'semibold', color: 'red' }}>{place.businessStatus}</p>
                                )}
                                <div className='flex items-center justify-center pt-2 space-x-2'>
                                    <div className={`w-24 flex flex-col space-y-1 justify-center items-center p-1 ${!place.isLead ? 'hover:bg-gray-100 cursor-pointer custom-shadow' : 'bg-transparent cursor-default'}`} onClick={() => !place.isLead && handleDesignIssueClick(place)}>
                                        <img src='../static/images/design.png' className='w-5 h-5 select-none' alt=''/>
                                        <p className='rounded'>DESIGN ISSUE</p>
                                    </div>
                                    <div className={`w-24 flex flex-col space-y-1 justify-center p-1 items-center ${!place.isLead ? 'hover:bg-gray-100 cursor-pointer custom-shadow ' : 'bg-transparent cursor-default'}`} onClick={() => !place.isLead && handleSeoIssueClick(place)}>
                                        <img src='../static/images/seo.png' className='w-5 h-5 select-none' alt=''/>
                                        <p className='rounded'>SEO ISSUE</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex px-4 items-center'>
                                <div className='flex items-center justify-center hover:bg-gray-200 rounded p-1 cursor-pointer select-none'>
                                    <img onClick={() => handleDeleteClick(place.id)} className='w-6 h-6' src='../static/images/trash.png' alt=''/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default SavedPlaces
