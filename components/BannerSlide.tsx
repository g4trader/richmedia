import React from 'react';
import { OfferData } from '../types';
import { GraduationCap, ArrowRight, Star } from 'lucide-react';

interface BannerSlideProps {
  data: OfferData;
  isActive: boolean;
  onCtaClick: () => void;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ data, isActive, onCtaClick }) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${data.colorFrom} ${data.colorTo} opacity-95`} />
      
      {/* Background Pattern/Image Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      {/* Content Grid */}
      <div className="relative z-20 h-full grid grid-cols-12 gap-4 items-center px-10 text-white">
        
        {/* Left: Text Content (Cols 1-7) */}
        <div className={`col-span-7 flex flex-col justify-center space-y-2 transform transition-transform duration-700 delay-100 ${isActive ? 'translate-x-0' : '-translate-x-10'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit mb-2 border border-white/30">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-100">{data.discount}</span>
          </div>

          {/* Main Headline - Limited to 2 lines to prevent layout break */}
          <h2 className="font-display font-extrabold text-4xl leading-tight drop-shadow-lg line-clamp-2 h-[3.6rem]">
            {data.headline}
          </h2>

          {/* Subtitle - Limited to 2 lines */}
          <p className="font-light text-lg text-gray-100 max-w-lg leading-snug line-clamp-2">
            {data.subtitle}
          </p>
          
          {/* Course Name Tag */}
          <div className="flex items-center space-x-2 text-sm font-medium opacity-80 mt-1">
            <GraduationCap className="w-4 h-4" />
            <span className="uppercase tracking-widest">{data.course}</span>
          </div>
        </div>

        {/* Right: Image & CTA (Cols 8-12) - Fixed Absolute Positioning */}
        <div className="col-span-5 h-full relative">
          
          {/* Circular Image Mask - Fixed Position z-10 */}
          <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl transform transition-all duration-1000 z-10 ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            <img 
              src={data.image || `https://picsum.photos/400/250?seed=${data.id}`} 
              alt={data.course} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating CTA Button - Fixed Position z-20 (Always on top) */}
          <button
            onClick={onCtaClick}
            className={`absolute bottom-8 right-48 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg py-3 px-8 rounded-full shadow-lg shadow-black/30 flex items-center space-x-2 group transition-all duration-300 z-20 transform hover:-translate-y-1 hover:scale-105 active:scale-95 ${isActive ? 'animate-bounce-subtle' : ''}`}
          >
            <span className="whitespace-nowrap">{data.ctaText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};