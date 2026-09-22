import React, { useState } from 'react';
import { ProductImage } from '../../types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800';

  const galleryList = images && images.length > 0
    ? images
    : [{ url: defaultFallback, alt: productName, isPrimary: true, displayOrder: 1 }];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentImage = galleryList[selectedImageIndex] || galleryList[0];

  return (
    <div className="space-y-4">
      {/* Main Large Image Box */}
      <div className="relative aspect-square bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center group">
        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="eager"
        />
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                selectedImageIndex === idx
                  ? 'border-brand-purple ring-2 ring-brand-purple/20 scale-95'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
