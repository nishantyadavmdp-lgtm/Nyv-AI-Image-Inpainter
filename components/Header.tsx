import React from 'react';
import { StarFilledIcon } from './icons/StarFilledIcon';
import { LogoIcon } from './icons/LogoIcon';

interface HeaderProps {
  starredImagesCount: number;
  onOpenGallery: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ starredImagesCount, onOpenGallery, onLogoClick }) => {
  return (
    <header className="p-4 border-b border-gray-700 shadow-lg bg-gray-800/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={onLogoClick} className="flex items-center gap-3 text-left">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold text-cyan-400">Nyv AI Image Inpainter</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Edit images with the power of Gemini</p>
          </div>
        </button>
        <button
          onClick={onOpenGallery}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          title="View starred images"
        >
          <StarFilledIcon className="w-5 h-5 text-yellow-400" />
          <span className="hidden sm:inline">Favorites</span>
          <span className="bg-cyan-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {starredImagesCount}
          </span>
        </button>
      </div>
    </header>
  );
};