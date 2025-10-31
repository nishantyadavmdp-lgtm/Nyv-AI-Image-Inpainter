import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-4 mt-8 border-t border-gray-700 bg-gray-800">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Nyv AI Image Inpainter. All Rights Reserved.</p>
        <p className="mt-1 text-xs text-gray-500">
          Powered by <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Gemini</a>
        </p>
      </div>
    </footer>
  );
};