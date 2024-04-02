import React from 'react'
import { Link } from 'react-router-dom'; 
import {useFirebase} from '../context/firebase'

const LandingPage = ({user}) => {
  const firebase = useFirebase();

  const handleLogoutClick = async () => {
    try {
        await firebase.getAuth().signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

  return (
    <section className='w-full h-full'>
      {user && <div className='absolute top-0 right-0 p-2 custom-shadow-1 bg-gray-800 rounded'>
                    <div className='w-full rounded p-2'>
                        <div className='flex flex-row justify-end items-center space-x-4 text-white'>
                            {!user.isAnonymous && (<img src={user.photoURL} className='w-8 h-8 rounded-full' alt='' />)}
                            <p>{user.displayName || user.email}</p>
                            {user.isAnonymous && (<p>Guest</p>)}
                            <div onClick={handleLogoutClick} className=' hover:bg-gray-600 p-2 rounded cursor-pointer transition-all duration-200'>
                                <img src='../static/images/logout.png' className='w-6 h-6' alt=''/>
                            </div>
                        </div>
                    </div>
                </div>}
      <div className='w-full h-screen flex border border-black p-2 tracking-wide'>
        <div className='w-1/2 flex justify-center items-center text-center text-xs border border-black text-gray-200'>
            <Link to={'/home'} className='w-32 bg-gray-800 rounded p-2'>
                <p className=''>NEW SEARCH</p>
            </Link>
        </div>
        <div className='w-1/2 flex justify-center items-center text-center text-xs border border-black text-gray-200'>
            <Link to={'/saved-places'} className='w-32 bg-gray-800 rounded p-2'>
                <p>SAVED PLACES</p>
            </Link>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
