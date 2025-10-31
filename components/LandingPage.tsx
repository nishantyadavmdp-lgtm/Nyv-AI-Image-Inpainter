import React from 'react';
import { Footer } from './Footer';
import { LogoIcon } from './icons/LogoIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { PaintbrushIcon } from './icons/PaintbrushIcon';
import { TypeIcon } from './icons/TypeIcon';
import { SparklesIcon } from './icons/SparklesIcon';


interface LandingPageProps {
  onLaunchApp: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center flex flex-col items-center">
        <div className="bg-gray-700 p-3 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{children}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl font-bold text-cyan-400">Nyv AI Image Inpainter</h1>
          </div>
           <button
            onClick={onLaunchApp}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300"
          >
            Launch App
          </button>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 px-4 bg-gray-900">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                Reimagine Your Images with <span className="text-cyan-400">AI</span>.
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                Effortlessly edit, inpaint, and transform any part of your picture with a simple text prompt. Powered by Gemini.
            </p>
            <button
                onClick={onLaunchApp}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300"
            >
                Get Started Now
            </button>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-bold text-center mb-12">How It Works in 4 Easy Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   <FeatureCard icon={<UploadCloudIcon className="w-7 h-7 text-cyan-300" />} title="1. Upload Image">
                        Start with any image from your device.
                   </FeatureCard>
                   <FeatureCard icon={<PaintbrushIcon className="w-7 h-7 text-cyan-300" />} title="2. Mask Area">
                        Select the area you want to change with the brush.
                   </FeatureCard>
                   <FeatureCard icon={<TypeIcon className="w-7 h-7 text-cyan-300" />} title="3. Write Prompt">
                        Describe what you want to create in the selected area.
                   </FeatureCard>
                   <FeatureCard icon={<SparklesIcon className="w-7 h-7 text-cyan-300" />} title="4. Generate">
                        Let our AI work its magic and generate your new image.
                   </FeatureCard>
                </div>
            </div>
        </section>
        
        {/* Features Section */}
         <section className="py-20 px-4 bg-gray-900">
            <div className="max-w-5xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-12">Powerful Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    {['Precise Masking Tools', 'AI-Powered Inpainting', 'Before & After Slider', 'Favorites Gallery'].map(feature => (
                        <li key={feature} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 border border-gray-700">
                            <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
