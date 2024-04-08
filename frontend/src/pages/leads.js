import React, { useState } from 'react';
import axios from 'axios';
import { useFirebase } from '../context/firebase';

const Leads = ({leads, setLeads, user}) => {
    const firebase = useFirebase();
    
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
            const response = await axios.delete(`http://localhost:5000/api/leads/${id}`);
            if (response.status === 200) {
                const updatedLeads = leads.filter(lead => lead._id !== id);
                setLeads(updatedLeads);
                console.log(`Lead with ID ${id} deleted successfully`);
            } else {
                console.error('Failed to delete lead');
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

  return (
    <section className='w-full min-h-screen bg-gray-100 py-10 tracking-wide'>
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
        <div className='mx-auto w-4/5 flex flex-col items-center min-h-[80vh] bg-white custom-shadow'>
            <div className='flex items-center justify-center h-20 w-full'>
                <p className='font-bold text-sm tracking-wider'>LEADS</p>
            </div>
            <div className='flex flex-col w-full space-y-3 p-4'>
                {leads.map((lead, index) => (
                    <div key={index} className='space-y-3'>
                        <div className='flex w-full p-2 border border-gray-400 border-x-0 border-t-0 bg-gray-100 rounded custom-shadow-1' key={lead._id}>
                            <div className='w-1/2 flex flex-col items-start'>
                                <p className='p-2 font-semibold hover:underline cursor-pointer'>Place ID: {lead.placeId}</p>
                                <div className='p-2 flex items-center justify-center space-x-2'>
                                    <p className='text-sm'>Issue: {lead.issue}</p> 
                                </div>
                                <div className='w-full flex space-x-2 justify-start items-center p-2 rounded text-sm'>
                                    <p>Contacted Via: {lead.contactedVia}</p>
                                </div>
                            </div>
                            <div className='w-1/2 flex flex-col items-start text-sm'>
                                <div className='flex space-x-2 justify-center p-2 items-center'>
                                    {lead.responseReceived ? (<p className='w-full rounded text-center text-green-500 font-semibold'>Response received</p>) : (<p className='w-full rounded text-center'>Not Responded</p>)}
                                </div>
                                {lead.responseReceived && (<div className='flex space-x-2 justify-center p-2 items-center'>
                                    <p className='w-full rounded text-center'>Responded Via: {lead.responseVia}</p>
                                </div>)}
                                <div className='flex p-2 space-x-2 items-center justify-center'>
                                <p className='w-full rounded text-center'>Response: {lead.response}</p>
                                </div>
                            </div>
                            <div className='flex px-4 items-center'>
                                <div className='flex items-center justify-center hover:bg-gray-200 rounded p-1 cursor-pointer select-none'>
                                    <img onClick={() => handleDeleteClick(lead._id)} className='w-6 h-6' src='../static/images/trash.png' alt=''/>
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

export default Leads
