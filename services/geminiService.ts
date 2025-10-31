
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a fallback for local development where process.env might not be configured.
  // In the target environment, process.env.API_KEY is expected to be available.
  console.warn("API_KEY is not set. Using a placeholder. This will fail in a real environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Helper to extract MIME type from base64 string
const getMimeType = (base64: string): string => {
  const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    return mime[1];
  }
  return 'image/png'; // default
};

// Helper to strip data URL prefix
const stripPrefix = (base64: string): string => {
  return base64.split(',')[1];
};

export const generateImageEdit = async (
  originalImageBase64: string,
  maskImageBase64: string,
  prompt: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const originalImageMimeType = getMimeType(originalImageBase64);
  const cleanOriginalImageBase64 = stripPrefix(originalImageBase64);

  // The mask is generated as PNG from canvas
  const cleanMaskImageBase64 = maskImageBase64;
  
  const originalImagePart = {
    inlineData: {
      data: cleanOriginalImageBase64,
      mimeType: originalImageMimeType,
    },
  };

  const maskImagePart = {
    inlineData: {
      data: cleanMaskImageBase64,
      mimeType: 'image/png',
    },
  };
  
  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [originalImagePart, maskImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image data from the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data found in the API response.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image edit. Please check your prompt or try again.");
  }
};
