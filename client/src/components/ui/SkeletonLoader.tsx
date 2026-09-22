import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
  );
};
