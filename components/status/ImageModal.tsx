import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1 shadow-lg text-gray-700 hover:text-red-500 transition"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={imageUrl}
          alt="Foto Lokasi"
          className="w-full h-full object-contain max-h-[calc(90vh-2rem)]"
        />
      </div>
    </div>
  );
};