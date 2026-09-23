import React, { useState } from 'react';
import { ProductImage } from '../../types';

interface ProductGalleryProps {
  images?: ProductImage[];
  productName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800';

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName = 'KING DAY Product' }) => {
  const validImages = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];
  const galleryList = validImages.length > 0
    ? validImages
    : [{ url: DEFAULT_FALLBACK, alt: productName, isPrimary: true, displayOrder: 1 }];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const safeIndex = selectedImageIndex < galleryList.length ? selectedImageIndex : 0;
  const currentImage = galleryList[safeIndex] || galleryList[0];

  return (
    <div className="space-y-4">
      {/* Main Large Image Box */}
      <div className="relative aspect-square bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center group">
        <img
          src={currentImage?.url || DEFAULT_FALLBACK}
          alt={currentImage?.alt || productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK;
          }}
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
                safeIndex === idx
                  ? 'border-brand-purple ring-2 ring-brand-purple/20 scale-95'
                  : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img?.url || DEFAULT_FALLBACK}
                alt={img?.alt || `${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
