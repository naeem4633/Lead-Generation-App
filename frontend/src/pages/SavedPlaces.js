import React from 'react'
import axios from 'axios';
import { useFirebase } from '../context/firebase';

const SavedPlaces = ({savedPlaces, setSavedPlaces, user}) => {
    const firebase = useFirebase();

    const handleLogoutClick = async () => {
        try {
            await firebase.getAuth().signOut();
            console.log("User signed out successfully");
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    let overallIndex = 0;

    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/places/${id}`);
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
        {user && <div className='absolute top-0 right-0 p-2 custom-shadow-1 bg-gray-800 rounded'>
                    <div className='w-full rounded p-2'>
                        <div className='flex flex-row justify-end items-center space-x-4 text-gray-200'>
                            <img src={user.photoURL} className='w-8 h-8 rounded-full' alt='' />
                            <p>{user.displayName || user.email}</p>
                            <div onClick={handleLogoutClick} className=' hover:bg-gray-600 p-2 rounded cursor-pointer transition-all duration-200'>
                                <img src='../static/images/logout.png' className='w-6 h-6'></img>
                            </div>
                        </div>
                    </div>
                </div>}
        <div className='mx-auto w-4/5 flex flex-col items-center min-h-[80vh] bg-white custom-shadow'>
            <div className='flex items-center justify-center h-20 w-full'>
                <p className='font-bold text-sm tracking-wider'>SAVED PLACES</p>
            </div>
            <div className='flex flex-col w-full space-y-3 p-4'>
                {savedPlaces.map((place, index) => (
                    <div key={index} className='space-y-3'>
                        <div className='flex w-full p-2 border border-gray-400 border-x-0 border-t-0 bg-gray-100 rounded custom-shadow-1' key={place.id}>
                            <div className='flex px-4 items-center'>
                                <p>{overallIndex += 1}</p>
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
                                <div className='flex items-center justify-center hover:bg-gray-200 rounded p-1 cursor-pointer'>
                                    <img onClick={() => handleDeleteClick(place.id)} className='w-6 h-6' src='../static/images/trash.png'/>
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
