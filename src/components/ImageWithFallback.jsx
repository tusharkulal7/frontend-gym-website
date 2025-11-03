import React, { useState } from 'react';
import { STATIC_IMAGES } from '../constants/staticImages';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = STATIC_IMAGES.gymBackground,
  loading = 'lazy',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        {...props}
      />
      {hasError && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
          Fallback Image
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
