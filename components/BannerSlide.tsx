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
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      {/* Content Grid */}
      <div className="relative z-20 h-full grid grid-cols-12 gap-4 px-10 text-white">
        
        {/* Left: Text Content (Cols 1-7) */}
        {/* COMPACTED LAYOUT: Reduced pt-6 to pt-5, space-y-3 to space-y-2 */}
        <div className={`col-span-7 flex flex-col pt-5 space-y-2 transform transition-transform duration-700 delay-100 ${isActive ? 'translate-x-0' : '-translate-x-10'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full w-fit border border-white/30">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-100">{data.discount}</span>
          </div>

          {/* Main Headline - Reduced to text-3xl to fit 2 lines vertically */}
          <h2 className="font-display font-extrabold text-3xl leading-tight drop-shadow-lg line-clamp-2">
            {data.headline}
          </h2>

          {/* Subtitle - Reduced to text-base */}
          <p className="font-light text-base text-gray-100 max-w-lg leading-snug line-clamp-2">
            {data.subtitle}
          </p>
          
          {/* Course Name Tag */}
          <div className="flex items-center space-x-2 text-xs font-medium opacity-80 pt-1">
            <GraduationCap className="w-4 h-4" />
            <span className="uppercase tracking-widest">{data.course}</span>
          </div>
        </div>

        {/* CTA Button - Fixed Absolute Position Bottom Left */}
        <button
          onClick={onCtaClick}
          className={`absolute bottom-4 left-10 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg py-2.5 px-8 rounded-full shadow-lg shadow-black/30 flex items-center space-x-2 group transition-all duration-300 z-30 transform hover:-translate-y-1 hover:scale-105 active:scale-95 ${isActive ? 'animate-bounce-subtle' : ''}`}
        >
          <span className="whitespace-nowrap">{data.ctaText}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Right: Person/Cutout Image (Cols 8-12) */}
        <div className="col-span-5 h-full relative">
          {/* Cutout Image - Anchored to bottom right */}
          <img 
            src={data.image || `https://placehold.co/300x500/png?text=${data.course}`} 
            alt={data.course} 
            className={`absolute bottom-0 right-0 max-h-[95%] w-auto object-contain drop-shadow-2xl transition-all duration-1000 ease-out transform ${
              isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
};