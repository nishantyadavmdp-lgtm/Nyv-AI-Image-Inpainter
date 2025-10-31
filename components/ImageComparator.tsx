import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparatorProps {
  originalUrl: string;
  editedUrl: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalUrl, editedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
  }, [isDragging, handleMove]);


  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div 
        ref={containerRef}
        className="relative w-full max-w-full aspect-[4/3] sm:aspect-video lg:aspect-auto select-none rounded-lg overflow-hidden shadow-lg cursor-ew-resize bg-gray-900"
        style={{ touchAction: 'none' }} // Prevents page scrolling on touch devices
    >
      <img
        src={originalUrl}
        alt="Original"
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        draggable="false"
      />
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={editedUrl}
          alt="Edited"
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
          draggable="false"
        />
        <div className="absolute top-2 right-2 h-auto p-1 px-2 bg-black/50 backdrop-blur-sm rounded-md">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Edited</span>
        </div>
      </div>
      <div className="absolute top-2 left-2 h-auto p-1 px-2 bg-black/50 backdrop-blur-sm rounded-md">
        <span className="text-white text-xs font-bold uppercase tracking-wider">Original</span>
      </div>
      <div
        className="absolute top-0 h-full w-1 bg-cyan-400/90 cursor-ew-resize transform -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 h-10 w-10 rounded-full bg-cyan-400 border-4 border-gray-900 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
        </div>
      </div>
    </div>
  );
};