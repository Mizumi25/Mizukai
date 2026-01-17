'use client'

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import './style.css';

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  allMedia?: MediaItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  media,
  allMedia = [],
  currentIndex = 0,
  onNavigate,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    // Handle arrow keys for navigation
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!isOpen || allMedia.length <= 1) return;
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate?.(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < allMedia.length - 1) {
        onNavigate?.(currentIndex + 1);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleArrowKeys);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [isOpen, onClose, allMedia.length, currentIndex, onNavigate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < allMedia.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, allMedia.length, onNavigate]);

  if (!isOpen || !media) return null;

  const hasNavigation = allMedia.length > 1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMedia.length - 1;

  return (
    <div className={`media-modal ${isOpen ? 'is-open' : ''} ${isAnimating ? 'is-animating' : ''}`}>
      {/* Background overlay */}
      <div className="media-modal__bg" onClick={onClose} />
      
      {/* Close button */}
      <button className="media-modal__close" onClick={onClose} aria-label="Close modal">
        <span className="media-modal__close-line" />
        <span className="media-modal__close-line" />
      </button>

      {/* Navigation - Previous */}
      {hasNavigation && (
        <button 
          className={`media-modal__nav media-modal__nav--prev ${!hasPrev ? 'is-disabled' : ''}`}
          onClick={handlePrev}
          disabled={!hasPrev}
          aria-label="Previous"
        >
          <span className="media-modal__nav-arrow" />
        </button>
      )}

      {/* Navigation - Next */}
      {hasNavigation && (
        <button 
          className={`media-modal__nav media-modal__nav--next ${!hasNext ? 'is-disabled' : ''}`}
          onClick={handleNext}
          disabled={!hasNext}
          aria-label="Next"
        >
          <span className="media-modal__nav-arrow" />
        </button>
      )}

      {/* Content */}
      <div className="media-modal__content">
        <div className="media-modal__inner">
          {media.type === 'video' ? (
            <video
              key={media.src}
              className="media-modal__video"
              src={media.src}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="media-modal__image-wrapper">
              <Image
                key={media.src}
                src={media.src}
                alt={media.alt || 'Modal image'}
                fill
                className="media-modal__image"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          )}
          
          {/* Info */}
          {(media.title || media.subtitle) && (
            <div className="media-modal__info">
              {media.title && <h3 className="media-modal__title">{media.title}</h3>}
              {media.subtitle && <p className="media-modal__subtitle">{media.subtitle}</p>}
            </div>
          )}

          {/* Counter */}
          {hasNavigation && (
            <div className="media-modal__counter">
              <span>{currentIndex + 1}</span>
              <span className="media-modal__counter-separator">/</span>
              <span>{allMedia.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
