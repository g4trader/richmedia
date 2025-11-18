import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  total: number;
  current: number;
}

export const Controls: React.FC<ControlsProps> = ({ onPrev, onNext, onDotClick, total, current }) => {
  return (
    <>
      {/* Arrows - Show on Parent Hover (Handled by group-hover in parent) */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); onDotClick(idx); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </>
  );
};
