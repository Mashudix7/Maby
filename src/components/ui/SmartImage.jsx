import { useState, memo } from 'react';

const SmartImage = memo(function SmartImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-[4/3]',
  loading = 'lazy'
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-zinc-100 dark:bg-white/5`}>
      {/* Skeleton/Placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-outline-variant bg-zinc-200 dark:bg-white/5">
          <span className="material-symbols-outlined text-2xl">image_not_supported</span>
        </div>
      )}

      {/* Actual Image */}
      {src && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
});

export default SmartImage;
