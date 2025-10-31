
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { BrushIcon } from './icons/BrushIcon';
import { EraserIcon } from './icons/EraserIcon';
import { Tool } from '../types';

interface ImageEditorProps {
  imageUrl: string;
}

export interface ImageEditorHandle {
  getMaskAsBase64: () => string | null;
  clearMask: () => void;
}

export const ImageEditor = forwardRef<ImageEditorHandle, ImageEditorProps>(({ imageUrl }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>(Tool.BRUSH);
  const [brushSize, setBrushSize] = useState(40);

  const getCanvasContext = (canvas: HTMLCanvasElement | null) => canvas?.getContext('2d');

  const drawImageOnCanvas = useCallback(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const container = containerRef.current;
      const imageCanvas = imageCanvasRef.current;
      const drawingCanvas = drawingCanvasRef.current;
      if (!container || !imageCanvas || !drawingCanvas) return;

      const { clientWidth } = container;
      const scale = clientWidth / image.width;
      const height = image.height * scale;

      imageCanvas.width = clientWidth;
      imageCanvas.height = height;
      drawingCanvas.width = clientWidth;
      drawingCanvas.height = height;

      const ctx = getCanvasContext(imageCanvas);
      ctx?.drawImage(image, 0, 0, clientWidth, height);
    };
  }, [imageUrl]);

  useEffect(() => {
    drawImageOnCanvas();
    const handleResize = () => drawImageOnCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawImageOnCanvas]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = getCanvasContext(drawingCanvasRef.current);
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext(drawingCanvasRef.current);
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.globalCompositeOperation = tool === Tool.ERASER ? 'destination-out' : 'source-over';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext(drawingCanvasRef.current);
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };
  
  const clearMask = () => {
      const canvas = drawingCanvasRef.current;
      const ctx = getCanvasContext(canvas);
      if(ctx && canvas) {
          ctx.clearRect(0,0, canvas.width, canvas.height);
      }
  };

  useImperativeHandle(ref, () => ({
    getMaskAsBase64: () => {
      const originalCanvas = drawingCanvasRef.current;
      if (!originalCanvas) return null;
      
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = originalCanvas.width;
      maskCanvas.height = originalCanvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      if(!maskCtx) return null;

      // Check if the canvas is empty
      const canvasData = originalCanvas.getContext('2d')?.getImageData(0,0,originalCanvas.width, originalCanvas.height);
      if (!canvasData || canvasData.data.every(pixel => pixel === 0)) {
        return null; // The mask is empty
      }
      
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.drawImage(originalCanvas, 0, 0);
      
      // Convert semi-transparent white to fully opaque white
      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // If pixel is not transparent
              data[i] = 255;     // R
              data[i + 1] = 255; // G
              data[i + 2] = 255; // B
              data[i + 3] = 255; // A
          }
      }
      maskCtx.putImageData(imageData, 0, 0);

      return maskCanvas.toDataURL('image/png').split(',')[1];
    },
    clearMask,
  }));

  return (
    <div className="relative w-full" ref={containerRef}>
      <canvas ref={imageCanvasRef} className="absolute top-0 left-0 w-full h-auto rounded-lg" />
      <canvas
        ref={drawingCanvasRef}
        className="relative top-0 left-0 w-full h-auto cursor-crosshair rounded-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 p-2 rounded-lg flex flex-col gap-3">
        <button onClick={() => setTool(Tool.BRUSH)} className={`p-2 rounded ${tool === Tool.BRUSH ? 'bg-cyan-500' : 'bg-gray-700'}`} title="Brush">
          <BrushIcon className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setTool(Tool.ERASER)} className={`p-2 rounded ${tool === Tool.ERASER ? 'bg-cyan-500' : 'bg-gray-700'}`} title="Eraser">
          <EraserIcon className="w-6 h-6 text-white" />
        </button>
         <button onClick={clearMask} className="p-2 rounded bg-gray-700" title="Clear Mask">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
        <div className="p-2">
            <input 
                type="range" 
                min="5" 
                max="100" 
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </div>
    </div>
  );
});
