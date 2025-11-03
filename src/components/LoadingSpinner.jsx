import React from 'react';

const LoadingSpinner = ({ fullScreen = true, message = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-white font-agency text-lg animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-black">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
