import { useState } from "react";
import type { FeatureComponentProps } from "../../types";
import { LoadingSpinner } from "../common/LoadingSpinner";

// Local fallback kitten images (base64 encoded small placeholders)
const FALLBACK_KITTENS = [
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMTUwIDEwMEMxNTAgNzIgMTcyIDUwIDIwMCA1MFMyNTAgNzIgMjUwIDEwMFMyMjggMTUwIDIwMCAxNTBTMTUwIDEyOCAxNTAgMTAwWiIgZmlsbD0iIzk5OSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iOTAiIHI9IjUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTcwIDEzMEMxNzAgMTMwIDE4NSAxNTAgMjAwIDE1MFMyMzAgMTMwIDIzMCAxMzAiIHN0cm9rZT0iIzY2NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTE0MCAyMjBMMTYwIDIwMEwyNDAgMjAwTDI2MCAyMjAiIHN0cm9rZT0iIzY2NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlNWU1ZTUiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSIjZmZhYzMwIi8+PGNpcmNsZSBjeD0iMTcwIiBjeT0iOTAiIHI9IjgiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSIyMzAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0xNzAgMTQwTDIzMCAxNDAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTE1MCAyMjBMMjUwIDIyMCIgc3Ryb2tlPSIjZmZhYzMwIiBzdHJva2Utd2lkdGg9IjEwIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlNWU1ZTUiLz48cGF0aCBkPSJNMTUwIDExMEMxNTAgODAgMTc1IDU1IDIwMCA1NVMyNTAgODAgMjUwIDExMFMyMjUgMTY1IDIwMCAxNjVTMTUwIDE0MCAxNTAgMTEwWiIgZmlsbD0iI2ZmY2NjYyIvPjxjaXJjbGUgY3g9IjE3MCIgY3k9IjEwMCIgcj0iNiIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjIzMCIgY3k9IjEwMCIgcj0iNiIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0xNzUgMTMwTDIyNSAxMzAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTE2MCAyMTBMMjQwIDIxMCIgc3Ryb2tlPSIjZmZjY2NjIiBzdHJva2Utd2lkdGg9IjgiLz48L3N2Zz4=",
];

export const Kittens = ({ userId, companyId }: FeatureComponentProps) => {
  // Generate a consistent kitten image based on userId
  const kittenId = userId ? parseInt(userId.toString(), 10) % 100 : 1;
  const externalUrl = `https://placekittens.com/400/300?image=${kittenId}`;
  const fallbackIndex = kittenId % FALLBACK_KITTENS.length;
  const fallbackUrl = FALLBACK_KITTENS[fallbackIndex];
  
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setUseFallback(true);
  };

  const imageUrl = useFallback ? fallbackUrl : externalUrl;
  const imageKey = `${userId}-${useFallback ? 'fallback' : 'external'}`;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Kittens</h3>
      <div className="bg-gray-100 rounded-lg overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <LoadingSpinner />
          </div>
        )}
        <img
          key={imageKey}
          src={imageUrl}
          alt="Random kitten"
          className={`w-full h-auto transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Random kitten for user {userId}
        {companyId && ` in company ${companyId}`}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {useFallback
          ? "Local kitten illustration"
          : "Powered by placekittens.com"}
      </p>
    </div>
  );
};
