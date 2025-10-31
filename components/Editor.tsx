import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageEditor, ImageEditorHandle } from './ImageEditor';
import { ImageUploader } from './ImageUploader';
import { PromptInput } from './PromptInput';
import { Loader } from './Loader';
import { StarredGallery } from './StarredGallery';
import { StarIcon } from './icons/StarIcon';
import { StarFilledIcon } from './icons/StarFilledIcon';
import { generateImageEdit } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import { Header } from './Header';
import { Footer } from './Footer';

interface EditorProps {
    onBackToHome: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onBackToHome }) => {
  const [originalImage, setOriginalImage] = useState<{ file: File; url: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [starredImages, setStarredImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  const editorRef = useRef<ImageEditorHandle>(null);

  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('starredImages');
      if (storedImages) {
        setStarredImages(JSON.parse(storedImages));
      }
    } catch (e) {
      console.error("Failed to parse starred images from localStorage", e);
      localStorage.removeItem('starredImages');
    }
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalImage({ file, url });
    setEditedImage(null);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage || !prompt || !editorRef.current) return;

    const maskBase64 = editorRef.current.getMaskAsBase64();
    if (!maskBase64) {
      setError("Please select an area on the image to edit.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const originalImageBase64 = await fileToBase64(originalImage.file);
      const resultBase64 = await generateImageEdit(originalImageBase64, maskBase64, prompt);
      
      setEditedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
    if(editorRef.current) {
        editorRef.current.clearMask();
    }
  };

  const handleDownload = (image: string) => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleStar = (image: string) => {
    const isStarred = starredImages.includes(image);
    let updatedImages;
    if (isStarred) {
      updatedImages = starredImages.filter(img => img !== image);
    } else {
      updatedImages = [...starredImages, image];
    }
    setStarredImages(updatedImages);
    localStorage.setItem('starredImages', JSON.stringify(updatedImages));
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header
        starredImagesCount={starredImages.length}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onLogoClick={onBackToHome}
      />
      
      <main className="flex-grow p-4 md:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-xl">
              <ImageEditor ref={editorRef} imageUrl={originalImage.url} />
            </div>
            
            <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-xl">
              <PromptInput prompt={prompt} setPrompt={setPrompt} />

              <div className="flex flex-col gap-4 mt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {isLoading ? <Loader /> : 'Generate'}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Start Over
                </button>
              </div>

              {error && <p className="text-red-400 text-center">{error}</p>}
              
              {editedImage && !isLoading && (
                 <div className="mt-4 flex flex-col items-center gap-4 border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-cyan-400">Result</h3>
                    <img src={editedImage} alt="Generated result" className="rounded-lg max-w-full h-auto shadow-lg" />
                    <div className="flex items-stretch justify-center w-full gap-2">
                      <button
                          onClick={() => handleDownload(editedImage)}
                          className="flex-grow bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                      >
                          Download Image
                      </button>
                       <button
                          onClick={() => toggleStar(editedImage)}
                          className={`p-3 rounded-lg transition-colors duration-300 ${starredImages.includes(editedImage) ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-700 hover:bg-gray-600'}`}
                          title={starredImages.includes(editedImage) ? 'Un-star image' : 'Star image'}
                          aria-label="Star image"
                      >
                          {starredImages.includes(editedImage) 
                              ? <StarFilledIcon className="w-6 h-6 text-white"/> 
                              : <StarIcon className="w-6 h-6 text-white"/>}
                      </button>
                    </div>
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      {isGalleryOpen && (
        <StarredGallery
            images={starredImages}
            onClose={() => setIsGalleryOpen(false)}
            onUnstar={toggleStar}
            onDownload={handleDownload}
        />
      )}
    </div>
  );
}