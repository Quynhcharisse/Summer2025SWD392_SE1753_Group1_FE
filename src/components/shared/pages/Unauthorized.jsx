import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">You do not have permission to access this page.</p>
      <button 
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized; 