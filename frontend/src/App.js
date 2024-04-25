import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import SavedPlaces from './pages/SavedPlaces';
import Leads from './pages/leads';
import axios from 'axios';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useFirebase } from './context/firebase';
import { useNavigate } from 'react-router-dom';
import {backendUrl} from './backendUrl';
import ErrorPage from './pages/ErrorPage';

function App() {
  const [user, setUser] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const firebase = useFirebase();

  useEffect(() => {
    const isScreenMobile = window.innerWidth <= 700;
    setIsMobile(isScreenMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.getAuth().onAuthStateChanged(async user => {
      if (!user) {
        console.log('No user is signed in.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        setUser(user);
        console.log(`${user.email} is signed in.`);
        
        // Send a request to check user role using axios
        try {
          const firebaseToken = await user.getIdToken();
          const response = await axios.get(`${backendUrl}api/check-user-role`, {
            headers: {
              'Authorization': `Bearer ${firebaseToken}`
            }
          });
          console.log('User role:', response.data); // Log the user role
          
          // Check if the user has the role of admin
          if (response.data === 'admin') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
    });
  
    return unsubscribe;
  }, [firebase]);
  




  useEffect(() => {
    const fetchSavedPlaces = async () => {
      if (!user) {
        return;
      }
      try {
        // Get Firebase authentication token from user object
        const firebaseToken = await user.getIdToken();

        // Set headers with Firebase token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
        };

        const response = await axios.get(`${backendUrl}api/places/by-user/${user.uid}`, {
            headers: headers
        });

        if (response.status === 200) {
          const savedPlacesReversed = response.data.reverse()
          setSavedPlaces(savedPlacesReversed);
        } else {
          console.error('Failed to fetch saved places');
        }
      } catch (error) {
        console.error('Error fetching saved places:', error);
      }
    };

    fetchSavedPlaces();
  }, [user]);
  
  useEffect(() => {
    console.log("saved places", savedPlaces);
  }, [savedPlaces]);
  
  useEffect(() => {
    const fetchLeads = async () => {
      if (!user) {
        return;
      }
      try {
        // Get Firebase authentication token from user object
        const firebaseToken = await user.getIdToken();

        // Set headers with Firebase token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`
        };

        const response = await axios.get(`${backendUrl}api/leads/by-user/${user.uid}`, {
            headers: headers
        });

        if (response.status === 200) {
          setLeads(response.data);
        } else {
          console.error('Failed to fetch leads');
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, [user]);

  useEffect(() => {
    console.log("leads", leads);
  }, [leads]);

  return (
    <Router>
      <div className="app">
        <div className="app-body">
          <Routes>
            <Route path="/" element={<LandingPage user={user} isMobile={isMobile}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login user={user} isMobile={isMobile}/>} />
            <Route path="/home" element={<Home user={user} isAdmin={isAdmin}/>} />
            <Route path="/saved-places" element={<SavedPlaces user={user} savedPlaces={savedPlaces} setSavedPlaces={setSavedPlaces}/>} />
            <Route path="/leads" element={<Leads user={user} leads={leads} setLeads={setLeads}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
