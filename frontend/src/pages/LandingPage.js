import React from 'react'
import { Link } from 'react-router-dom'; 
import {useFirebase} from '../context/firebase'
import MobileScreen from './MobileScreen';

const LandingPage = ({user, isMobile}) => {
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
    <>
    {isMobile && (<MobileScreen/>)}
    <section className='w-full h-screen'>
      <div className='w-full h-full'>
        <img src='../static/images/earth.png' className='w-full h-full'/>
      </div>
      <div className='absolute inset-0 -full h-full'>
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
        <div className='w-full h-screen flex p-2 space-x-1  font-semibold tracking-wider'>
          <div className='w-1/2 flex justify-center items-center text-center text-xs text-gray-200 rounded'>
            <Link to={'/home'} className='w-3/4 flex flex-col relative cursor-pointer hover:scale-95 transition-all duration-75 border-2 border-gray-200'>
              <div className='flex w-full absolute inset-0 bg-black items-end justify-center opacity-50'></div>
              <p className='absolute inset-0 flex items-center justify-center text-sm opacity-100'>NEW SEARCH</p>
              <img className='w-full h-full' src='./static/images/search.png'></img>
            </Link>
          </div>

          <div className='w-1/2 flex justify-center items-center text-center text-xs text-gray-200 rounded'>
            <Link to={'/saved-places'} className='w-3/4 flex flex-col relative cursor-pointer hover:scale-95 transition-all duration-75 border-2 border-gray-200'>
              <div className='flex w-full absolute inset-0 bg-black items-end justify-center opacity-50'></div>
              <p className='absolute inset-0 flex items-center justify-center text-sm opacity-100'>SAVED PLACES</p>
              <img className='w-full h-full' src='./static/images/saved-places.png'></img>
            </Link>
          </div>
          
          <div className='w-1/2 flex justify-center items-center text-center text-xs text-gray-200 rounded'>
            <Link to={'/leads'} className='w-3/4 flex flex-col relative cursor-pointer hover:scale-95 transition-all duration-75 border-2 border-gray-200'>
              <div className='flex w-full absolute inset-0 bg-black items-end justify-center opacity-50'></div>
              <p className='absolute inset-0 flex items-center justify-center text-sm opacity-100'>LEADS</p>
              <img className='w-full h-full' src='./static/images/leads.png'></img>
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default LandingPage
