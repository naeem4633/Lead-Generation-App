import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFirebase } from '../context/firebase';
import {backendUrl} from '../backendUrl';
import Spinner from '../components/Spinner';

const Leads = ({leads, setLeads, user, notification, setNotification}) => {
    let overallIndex = 0;
    const firebase = useFirebase();
    const [isLoading, setIsLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editStates, setEditStates] = useState({});
    const [editedLinks, setEditedLinks] = useState({});

    const handleEdit = (leadId) => {
        setEditStates(prevStates => ({
            ...prevStates,
            [leadId]: true
        }));
    };

    const handleCopyToClipboard = (link) => {
        navigator.clipboard.writeText(link)
            .then(() => {
                console.log('Link copied to clipboard');
                setNotification({ message: 'Link copied to clipboard', visible: true });
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                setNotification({ message: 'Failed to copy link', visible: true });
            });
    };

    const handleSave = async (leadId) => {
        try {
            // Update frontend state
            const updatedLeads = leads.map(lead => {
                if (lead._id === leadId) {
                    return { 
                        ...lead, 
                        facebook_link: editedLinks[leadId]?.facebook || lead.facebook_link,
                        instagram_link: editedLinks[leadId]?.instagram || lead.instagram_link,
                        email_address: editedLinks[leadId]?.email || lead.email_address,
                        figma_link: editedLinks[leadId]?.figma || lead.figma_link
                    };
                }
                return lead;
            });
            setLeads(updatedLeads);
            setEditStates(prevStates => ({
                ...prevStates,
                [leadId]: false
            }));
    
            // Update backend
            const updatedLead = await axios.put(`${backendUrl}api/leads/${leadId}`, {
                facebook_link: editedLinks[leadId]?.facebook || leads.find(lead => lead._id === leadId).facebook_link,
                instagram_link: editedLinks[leadId]?.instagram || leads.find(lead => lead._id === leadId).instagram_link,
                email_address: editedLinks[leadId]?.email || leads.find(lead => lead._id === leadId).email_address,
                figma_link: editedLinks[leadId]?.figma || leads.find(lead => lead._id === leadId).figma_link
            });
            console.log('Lead updated:', updatedLead.data);
        } catch (error) {
            console.error('Error updating lead:', error);
            setNotification({ message: 'Error Updating Lead', visible: true });
        }
    };

    // Simulating loading data
    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    
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
            const response = await axios.delete(`${backendUrl}api/leads/${id}`);
            if (response.status === 200) {
                const updatedLeads = leads.filter(lead => lead._id !== id);
                setLeads(updatedLeads);
                console.log(`Lead with ID ${id} deleted successfully`);
                setNotification({ message: `Lead with ID ${id} deleted successfully`, visible: true });
            } else {
                console.error('Failed to delete lead');
                setNotification({ message: 'Failed to delete lead', visible: true });
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
            setNotification({ message: 'Failed to delete lead', visible: true });
        }
    };
    
    const handleContactedViaClick = async (leadId, contactedVia) => {
        try {
            setLeads(prevLeads => prevLeads.map(lead => {
                if (lead._id === leadId) {
                    return { ...lead, [contactedVia]: !lead[contactedVia] };
                }
                return lead;
            }));
            const updatedLead = await axios.put(`${backendUrl}api/leads/${leadId}`, {
                [contactedVia]: !leads.find(lead => lead._id === leadId)[contactedVia]
            });
            // console.log('Lead updated:', updatedLead.data);
        } catch (error) {
            console.error('Error updating lead:', error);
            setNotification({ message: 'Error Updating Lead', visible: true });
        }
    };

  return (
    <section className='w-full min-h-screen bg-gray-100 py-10 tracking-wide'>
        {notification.visible && (
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 text-xs transition-all duration-500 custom-shadow-1">
                <p>{notification.message}</p>
            </div>
        )}
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
                <p className='font-bold text-sm tracking-wider'>LEADS</p>
            </div>
            <div className='flex flex-col w-full space-y-3 p-4'>
                {isLoading && leads.length === 0 && (<Spinner/>)}
                {!isLoading && leads.length === 0 && (<p className='w-full text-sm tracking-wider text-center'>No Leads to display. Select some places to convert them to leads.</p>)}
                {leads.length > 0 && leads.map((lead, index) => (
                    <div key={index} className='space-y-3'>
                        <div className='flex w-full p-2 border border-gray-400 border-x-0 border-t-0 bg-white custom-shadow-1' key={lead._id}>
                            <div className='flex px-4 items-center'>
                                <p>{overallIndex += 1}</p>
                            </div>
                            <div className='w-1/2 flex flex-col items-start space-y-2'>
                                <p className='font-semibold'>{lead.place.displayName}</p>
                                <div className='flex space-x-1 justify-center items-center text-xs'>
                                    <div className='flex justify-center items-center space-x-2 pl-1'>
                                        <img className='w-3 h-3 select-none' src='../static/images/star.png' alt=''/>
                                        <p className='font-semibold'>{lead.place.rating}</p>
                                    </div>
                                    <p className='text-xs' style={{ fontWeight: lead.place.userRatingCount < 10 ? 'bold' : 'normal', color: lead.place.userRatingCount < 10 ? 'red' : 'inherit' }}>
                                        ({lead.place.userRatingCount})
                                    </p> 
                                </div>
                                {lead.place.websiteUri ? (
                                    <div className='w-full flex space-x-2 justify-start items-center rounded cursor-pointer text-xs'>
                                        <div className='w-3/4 flex space-x-2 justify-start items-center p-1'>
                                            <a href={lead.place.websiteUri} target="_blank" rel="noopener noreferrer" className='w-fit'>
                                                <img className='w-3 select-none' src='../static/images/globe.png' alt=''/>
                                            </a>
                                            <a className='whitespace-nowrap overflow-hidden overflow-ellipsis w-[500px]' href={lead.place.websiteUri} target="_blank" rel="noopener noreferrer">
                                                {lead.place.websiteUri}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <p className='w-full font-semibold text-xs' style={{ fontWeight: 'semibold', color: 'red' }}>No website</p>
                                )}
                                <div className='text-xs flex space-x-2 justify-center pl-1 items-center'>
                                    <p className='w-full rounded text-center'>Issue: {lead.issue}</p>
                                </div>
                                <div className='flex space-x-1 items-center text-xs'>
                                    <a href={lead.figma_link} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center p-1 rounded hover:bg-gray-200 cursor-pointer'>
                                        <img src='../static/images/figma.png' className='w-5' alt=''/>
                                    </a>
                                    <p className='w-full rounded whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[300px]'>{editStates[lead._id] ? <input className='p-1 border' value={editedLinks[lead._id]?.figma || lead.figma_link} onChange={(e) => setEditedLinks({...editedLinks, [lead._id]: {...(editedLinks[lead._id] || {}), figma: e.target.value}})} /> : lead.figma_link}</p>
                                    <img 
                                        src='../static/images/copy.png' 
                                        className='w-4 cursor-pointer' 
                                        alt='Copy' 
                                        onClick={() => handleCopyToClipboard(lead.figma_link)}/>
                                </div>
                                <div className='flex space-x-6 pl-1 items-center text-xs'>
                                    <div className='flex space-x-3 justify-center items-center select-none'>
                                        <p>Contacted Via:</p>
                                        <p
                                            className={`px-2 py-1 text-center ${
                                                lead.contactedViaEmail ? 'border border-green-500 text-green-600 font-semibold' : 'bg-gray-100 border border-gray-100 custom-shadow hover:bg-gray-200'
                                            } cursor-pointer`}
                                            onClick={() => handleContactedViaClick(lead._id, 'contactedViaEmail')}
                                        >
                                            Email
                                        </p>
                                        <p
                                            className={`px-2 py-1 text-center ${
                                                lead.contactedViaDm ? 'border border-green-500 text-green-600 font-semibold' : 'bg-gray-100 border border-gray-100 custom-shadow hover:bg-gray-200'
                                            } cursor-pointer`}
                                            onClick={() => handleContactedViaClick(lead._id, 'contactedViaDm')}
                                        >
                                            DM
                                        </p>
                                        <p
                                            className={`px-2 py-1 text-center ${
                                                lead.contactedViaFb ? 'border border-green-500 text-green-600 font-semibold' : 'bg-gray-100 border border-gray-100 custom-shadow hover:bg-gray-200'
                                            } cursor-pointer`}
                                            onClick={() => handleContactedViaClick(lead._id, 'contactedViaFb')}
                                        >
                                            FB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-1/2 flex flex-col items-start text-xs space-y-2'>
                                <div className='flex items-center justify-center space-x-1'>
                                    <a href={lead.place.googleMapsUri} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center p-1 rounded hover:bg-gray-200'>
                                        <img className='w-4 select-none' src='../static/images/google.svg' alt=''/>
                                    </a>
                                    <p className='text-xs'>{lead.place.formattedAddress}</p> 
                                </div>
                                {lead.place.internationalPhoneNumber ? (
                                    <div className='flex space-x-2 justify-center pl-1 items-center'>
                                        <img src='../static/images/phone.svg' className='w-4 select-none' alt=''/>
                                        <p className='w-full rounded text-center'>{lead.place.internationalPhoneNumber}</p>
                                    </div>
                                ) : (
                                    <p className='font-semibold pl-1' style={{ fontWeight: 'semibold', color: 'red' }}>No contact info</p>
                                )}
                                {lead.place.businessStatus !== 'OPERATIONAL' && (
                                    <p className='' style={{ fontWeight: 'semibold', color: 'red' }}>{lead.place.businessStatus}</p>
                                )}
                                <div className='flex space-x-1 items-center'>
                                    <a href={`mailto:${lead.email_address}`} className='flex items-center justify-center p-1 rounded hover:bg-gray-200'>
                                        <img src='../static/images/email.png' className='w-6' alt=''/>
                                    </a>
                                    <p className='w-full rounded text-center'>{editStates[lead._id] ? <input className='p-1 border' value={editedLinks[lead._id]?.email || lead.email_address} onChange={(e) => setEditedLinks({...editedLinks, [lead._id]: {...(editedLinks[lead._id] || {}), email: e.target.value}})} /> : lead.email_address}</p>
                                </div>
                                <div className='flex space-x-1 items-center'>
                                    <a href={lead.facebook_link} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center p-1 rounded hover:bg-gray-200'>
                                        <img src='../static/images/facebook.png' className='w-6' alt=''/>
                                    </a>
                                    <p className='w-full rounded whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[300px]'>{editStates[lead._id] ? <input className='p-1 border' value={editedLinks[lead._id]?.facebook || lead.facebook_link} onChange={(e) => setEditedLinks({...editedLinks, [lead._id]: {...(editedLinks[lead._id] || {}), facebook: e.target.value}})} /> : lead.facebook_link}</p>
                                </div>
                                <div className='flex space-x-1 items-center'>
                                    <a href={lead.instagram_link} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center p-1 rounded hover:bg-gray-200'>
                                        <img src='../static/images/instagram.png' className='w-6' alt=''/>
                                    </a>
                                    <p className='w-full rounded whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[300px]'>{editStates[lead._id] ? <input className='p-1 border' value={editedLinks[lead._id]?.instagram || lead.instagram_link} onChange={(e) => setEditedLinks({...editedLinks, [lead._id]: {...(editedLinks[lead._id] || {}), instagram: e.target.value}})} /> : lead.instagram_link}</p>
                                </div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                {editStates[lead._id] && <div className='flex items-center justify-center hover:bg-gray-200 rounded p-1 cursor-pointer select-none'>
                                                <img onClick={() => handleSave(lead._id)} src='../static/images/check.png' className='w-5 select-none' alt='Save'/>
                                            </div>}
                                {!editStates[lead._id] && <div className='flex items-center justify-center hover:bg-gray-200 rounded p-1 cursor-pointer select-none'>
                                                <img onClick={() => handleEdit(lead._id)} src='../static/images/editing.png' className='w-5 select-none' alt='Edit'/>
                                            </div>}
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
