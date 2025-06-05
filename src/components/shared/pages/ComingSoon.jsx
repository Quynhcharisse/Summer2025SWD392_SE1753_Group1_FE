import React from 'react';
import PropTypes from 'prop-types';

/**
 * ComingSoon component - Placeholder for routes under development
 * @param {Object} props - Component props
 * @param {string} props.title - Title of the page/feature
 * @param {string} props.description - Optional description
 * @param {string} props.expectedDate - Optional expected completion date
 * @returns {JSX.Element}
 */
const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development.", 
  expectedDate = null 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        {expectedDate && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Expected Launch:</span> {expectedDate}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Development in progress</span>
          </div>
          
          <button 
            onClick={() => window.history.back()} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

ComingSoon.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  expectedDate: PropTypes.string,
};

export default ComingSoon;
