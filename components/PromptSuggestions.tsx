import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface PromptSuggestionsProps {
  setPrompt: (prompt: string) => void;
}

const suggestions = [
  'A cute Corgi wearing sunglasses',
  'Make it a cyberpunk city',
  'Turn it into an oil painting',
  'Add a majestic dragon flying',
  'A beautiful starry night sky',
];

const allPrompts = [
    ...suggestions,
    'A field of surreal, glowing flowers',
    'Add a vintage film grain effect',
    'A futuristic robot assistant',
    'Transform it into a cartoon style',
    'Cover it in tropical plants',
    'Add a cozy fireplace',
    'A UFO hovering in the sky',
    'Make it look like a watercolor painting',
    'Add a hidden treasure chest',
];

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ setPrompt }) => {
  const handleSurpriseMe = () => {
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
         <p className="text-sm font-medium text-gray-400">Or try one of these:</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setPrompt(s)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-200 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
       <button
        onClick={handleSurpriseMe}
        className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-cyan-300 hover:text-cyan-200 bg-gray-700/50 hover:bg-gray-700 rounded-lg py-2 transition-all"
       >
        <MagicWandIcon className="w-4 h-4" />
        Surprise Me
      </button>
    </div>
  );
};