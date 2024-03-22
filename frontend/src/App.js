import {React, useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import { samplePlaceData } from './samplePlaceData';

function App() {
  const [placesResponse, setPlacesResponse] = useState([]);
  
  useEffect(() => {
    console.log('Places:', placesResponse);
  }, [placesResponse]);


  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-body">
          <Routes>
            <Route path="/" element={<Home placesResponse={placesResponse} setPlacesResponse={setPlacesResponse} />} />
            <Route path="/search-results" element={<SearchResults placesResponse={placesResponse} setPlacesResponse={setPlacesResponse} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;