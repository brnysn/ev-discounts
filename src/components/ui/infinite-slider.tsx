"use client"

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteSliderProps {
  children: React.ReactNode;
  duration?: number;
  durationOnHover?: number;
  className?: string;
  gap?: number;
}

export const InfiniteSlider = ({
  children,
  duration = 25, // Default animation duration in seconds
  durationOnHover = 100, // Slow down animation on hover
  className,
  gap = 16,
}: InfiniteSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const updateContentWidth = () => {
      if (sliderRef.current) {
        const slider = sliderRef.current;
        let totalWidth = 0;
        
        // Calculate width of all direct children plus gaps
        Array.from(slider.children).forEach((child, index, arr) => {
          const childEl = child as HTMLElement;
          totalWidth += childEl.offsetWidth;
          if (index < arr.length - 1) {
            totalWidth += gap;
          }
        });
        
        setContentWidth(totalWidth);
      }
    };
    
    updateContentWidth();
    
    // Update content width on window resize
    window.addEventListener('resize', updateContentWidth);
    return () => window.removeEventListener('resize', updateContentWidth);
  }, [children, gap]);
  
  const currentDuration = isHovering ? durationOnHover : duration;
  
  return (
    <div 
      className={cn("relative overflow-hidden w-full", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <style jsx global>{`
        @keyframes slideAnimation {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${contentWidth}px);
          }
        }
      `}</style>
      
      <div 
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `slideAnimation ${currentDuration}s linear infinite`,
        }}
      >
        <div 
          className="slider-container flex"
          ref={sliderRef}
        >
          {children}
        </div>
        
        {/* Duplicate content for seamless looping */}
        <div 
          className="slider-container flex"
          style={{ marginLeft: `${gap}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};