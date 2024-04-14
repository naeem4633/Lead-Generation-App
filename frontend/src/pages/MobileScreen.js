import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MobileScreen = () => {
  return (
    <div className="absolute w-full h-screen z-50 bg-gray-800 text-white flex justify-center items-center">
      <h1>This app is not available for mobile.</h1>
    </div>
  );
};

export default MobileScreen;