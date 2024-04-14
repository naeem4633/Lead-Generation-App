import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center justify-center space-y-2'>
        <h1 >404 - Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link className='py-2 px-4 rounded bg-gray-800 text-white' to="/">Go back to home</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
