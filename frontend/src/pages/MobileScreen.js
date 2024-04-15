import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MobileScreen = () => {
  return (
    <div className="absolute w-full z-50 bg-gray-800 text-white h-screen flex justify-center items-center">
      <div className='flex flex-col justify-center items-center'>
        <h1>This app is not available for mobile.</h1>
        <h2>Use a PC instead</h2>
      </div>
    </div>
  );
};

export default MobileScreen;