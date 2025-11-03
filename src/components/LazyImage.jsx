import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ImageWithFallback from './ImageWithFallback';

const LazyImage = ({ src, alt, className, fallbackSrc, ...props }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver();

  return (
    <div ref={targetRef} className={className}>
      {hasIntersected ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          className={className}
          fallbackSrc={fallbackSrc}
          loading="lazy"
          {...props}
        />
      ) : (
        <div className={`${className} bg-gray-800 animate-pulse`} />
      )}
    </div>
  );
};

export default LazyImage;
