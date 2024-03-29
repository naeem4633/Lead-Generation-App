import React from 'react'
import { Link } from 'react-router-dom'; 

const LandingPage = () => {
  return (
    <section className='w-full h-full'>
      <div className='w-full h-screen flex border border-black p-2 tracking-wide'>
        <div className='w-1/2 flex justify-center items-center text-center text-xs border border-black text-gray-200'>
            <Link to={'/home'} className='w-32 bg-gray-800 rounded p-2'>
                <p>NEW SEARCH</p>
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
