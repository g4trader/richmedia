import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BannerSlide } from './components/BannerSlide';
import { Controls } from './components/Controls';
import { LeadModal } from './components/LeadModal';
import { AdminPanel } from './components/AdminPanel';
import { DEFAULT_OFFERS } from './constants';
import { OfferData } from './types';

const App: React.FC = () => {
  const [offers, setOffers] = useState<OfferData[]>(DEFAULT_OFFERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotate Slides
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  }, [offers.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  }, [offers.length]);

  // Auto-play Logic
  useEffect(() => {
    if (isPaused || isModalOpen) return;
    
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds per slide

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, isModalOpen, nextSlide, offers.length]); // Added offers.length dependency

  // Ensure current index is valid if offers change
  useEffect(() => {
    if (currentIndex >= offers.length && offers.length > 0) {
      setCurrentIndex(0);
    }
  }, [offers.length, currentIndex]);

  // Handlers
  const handleCtaClick = () => {
    setIsPaused(true); // Pause carousel while user interacts
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
  };

  const handleAddOffer = (newOffer: OfferData) => {
    setOffers(prev => [...prev, newOffer]);
    // Automatically jump to the new offer
    setCurrentIndex(offers.length); 
  };

  const handleUpdateOffers = (newOffers: OfferData[]) => {
    setOffers(newOffers);
    setCurrentIndex(0);
  };

  // Guard against empty offers
  if (offers.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      
      {/* Explanation Header */}
      <div className="mb-8 text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vestibular Rich Media Banner</h1>
        <p className="text-gray-600">
          Standard Leaderboard Size (970x250). Highly interactive, conversion-focused, and powered by AI.
        </p>
      </div>

      {/* BANNER CONTAINER - 970x250 */}
      <div 
        className="relative w-[970px] h-[250px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides */}
        {offers.map((offer, index) => (
          <BannerSlide 
            key={offer.id}
            data={offer}
            isActive={index === currentIndex}
            onCtaClick={handleCtaClick}
          />
        ))}

        {/* Controls (Arrows & Dots) */}
        <Controls 
          current={currentIndex}
          total={offers.length}
          onNext={nextSlide}
          onPrev={prevSlide}
          onDotClick={setCurrentIndex}
        />

        {/* Timer Line (Visual indicator of auto-play) */}
        {!isPaused && !isModalOpen && (
          <div className="absolute bottom-0 left-0 h-1 bg-yellow-400/50 z-40 animate-progress origin-left w-full" style={{ animationDuration: '5000ms' }} />
        )}
      </div>

      {/* Tailwind extension for the progress bar animation */}
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Admin Panel for Gemini Integration */}
      <AdminPanel 
        offers={offers}
        onAddOffer={handleAddOffer} 
        onUpdateOffers={handleUpdateOffers}
      />

      {/* Modals */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        courseInterest={offers[currentIndex]?.course || 'Vestibular'}
      />

      {/* Footer Info */}
      <div className="mt-12 text-center text-xs text-gray-400">
        <p>Developed with React, Tailwind, and Google Gemini API.</p>
        <p>Note: To deploy, export the JSON config and bundle with the source code.</p>
      </div>
    </div>
  );
};

export default App;