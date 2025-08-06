// client/src/components/common/Avatar.jsx
import React from 'react';
import { User } from 'lucide-react';

export default function Avatar({ 
  src, 
  alt, 
  size = 'medium', 
  className = '',
  fallback = null,
  showOnlineStatus = false,
  isOnline = false 
}) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
    xlarge: 'h-24 w-24'
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
    xlarge: 'h-12 w-12'
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Image principale */}
      {src && (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      )}
      
      {/* Fallback avec initiales ou icône */}
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ${src ? 'hidden' : 'flex'}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {fallback || (alt && getInitials(alt)) ? (
          <span className={`font-medium ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : size === 'xlarge' ? 'text-2xl' : 'text-sm'}`}>
            {fallback || getInitials(alt)}
          </span>
        ) : (
          <User className={iconSizes[size]} />
        )}
      </div>

      {/* Statut en ligne */}
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        } ${
          size === 'small' ? 'h-2 w-2' : 
          size === 'medium' ? 'h-3 w-3' : 
          size === 'large' ? 'h-4 w-4' : 'h-6 w-6'
        }`}></div>
      )}
    </div>
  );
}