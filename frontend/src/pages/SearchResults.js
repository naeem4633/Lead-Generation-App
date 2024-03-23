import { React, useState } from 'react'

const SearchResults = ({placesResponse}) => {
    let overallIndex = 0;

  return (
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
  )
}

export default SearchResults
