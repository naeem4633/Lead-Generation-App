import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import { samplePlaceData } from './samplePlaceData';
import LandingPage from './pages/LandingPage';
import SavedPlaces from './pages/SavedPlaces';
import Leads from './pages/leads';
import axios from 'axios';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useFirebase } from './context/firebase';
import {backendUrl} from './backendUrl';

function App() {
  const [user, setUser] = useState(null);
  const firebase = useFirebase();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.getAuth().onAuthStateChanged(user => {
      if (!user) {
        console.log('No user is signed in.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }else{
        setUser(user);  
        console.log(`${user.email} is signed in.`);
        // console.log("user in App.js", user)
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
        const response = await axios.get(`${backendUrl}api/places/by-user/${user.uid}`);
        if (response.status === 200) {
          setSavedPlaces(response.data);
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
        const response = await axios.get(`${backendUrl}/api/leads/by-user/${user.uid}`);
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
        {/* <Header /> */}
        <div className="app-body">
          <Routes>
            <Route path="/" element={<LandingPage user={user} savedPlaces={savedPlaces}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login user={user}/>} />
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/saved-places" element={<SavedPlaces user={user} savedPlaces={savedPlaces} setSavedPlaces={setSavedPlaces}/>} />
            <Route path="/leads" element={<Leads user={user} leads={leads} setLeads={setLeads}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
