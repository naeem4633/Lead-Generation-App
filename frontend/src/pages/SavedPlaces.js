import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFirebase } from '../context/firebase';
import '../savedPlaces.css'; 
import { backendUrl } from '../backendUrl';
import { useNavigate } from 'react-router-dom';

const SavedPlaces = ({savedPlaces, setSavedPlaces, user}) => {
    const navigate = useNavigate();
    const firebase = useFirebase();
    const [checkedItems, setCheckedItems] = useState([]);

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
                placeId: item,
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
            {!savedPlaces.length == 0 && (<button className='h-8 border border-gray-300 hover:border-gray-900 text-black tracking-wide text-sm rounded transition-all duration-300 font-semibold px-4' onClick={handleConvertToLeads}>Convert Selected to leads</button>)}
            <div className='flex flex-col w-full space-y-3 p-4'>
                {savedPlaces.length == 0 && (<p className='w-full text-sm tracking-wider text-center'>No Places to display. Perform a search to save places.</p>)}
                {savedPlaces.map((place, index) => (
                    <div key={index} className='space-y-3'>
                        <div className='flex w-full p-2 rounded custom-shadow-1' key={place.id}>
                            <div className='flex px-4 items-center'>
                                <label className="container">
                                    <input
                                        type="checkbox"
                                        checked={checkedItems.includes(place.id)}
                                        onChange={(event) => handleCheckboxChange(event, place.id)}
                                    />
                                    <div className="checkmark">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                            <title>Checkmark</title>
                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M416 128L192 384l-96-96"></path>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <div className='w-1/2 flex flex-col items-start'>
                                <p className='p-2 font-semibold'>{place.displayName}</p>
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
