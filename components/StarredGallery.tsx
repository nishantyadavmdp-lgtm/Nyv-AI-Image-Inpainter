
import React from 'react';
import { StarFilledIcon } from './icons/StarFilledIcon';

interface StarredGalleryProps {
  images: string[];
  onClose: () => void;
  onUnstar: (image: string) => void;
  onDownload: (image: string) => void;
}

export const StarredGallery: React.FC<StarredGalleryProps> = ({ images, onClose, onUnstar, onDownload }) => {
  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
            <StarFilledIcon className="w-6 h-6 text-yellow-400"/>
            My Starred Images
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close gallery">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...images].reverse().map((image, index) => (
                <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg border border-gray-700">
                  <img src={image} alt={`Starred image ${index + 1}`} className="w-full h-auto object-cover aspect-square" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center p-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 w-full max-w-xs">
                       <button
                        onClick={() => onDownload(image)}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => onUnstar(image)}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                      >
                        Un-star
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">You haven't starred any images yet.</p>
              <p className="text-sm text-gray-500 mt-2">Generate an edit and click the star icon to save it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
