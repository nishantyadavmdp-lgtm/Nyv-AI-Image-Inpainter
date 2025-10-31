
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
        Describe your edit
      </label>
      <textarea
        id="prompt"
        rows={4}
        className="block w-full text-sm text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-400 p-2.5 transition"
        placeholder="e.g., 'Make the shirt red' or 'Add a cat sitting on the bench'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  );
};
