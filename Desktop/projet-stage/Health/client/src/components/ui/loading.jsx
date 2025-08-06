// client/src/components/ui/Loading.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ 
  size = 'medium', 
  className = '', 
  text = '',
  fullScreen = false,
  color = '#4d89b1' 
}) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const LoadingSpinner = () => (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <Loader2 
          className={`${sizeClasses[size]} animate-spin`}
          style={{ color }}
        />
      </div>
      {text && (
        <p className={`${textSizes[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <LoadingSpinner />
      </div>
    );
  }

  return <LoadingSpinner />;
}