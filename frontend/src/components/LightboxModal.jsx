import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LightboxModal = ({ images, currentIdx, onClose }) => {
  const [index, setIndex] = useState(currentIdx);
  const image = images[index];

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (index < images.length - 1) {
      setIndex(prev => prev + 1);
    }
  }, [index, images.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (index > 0) {
      setIndex(prev => prev - 1);
    }
  }, [index]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-all z-10"
      >
        <X size={24} />
      </button>

      <div className="absolute top-4 left-4 p-4 text-white pointer-events-none">
        <h2 className="text-2xl font-semibold mb-1 drop-shadow-md">{image.title}</h2>
        <div className="flex gap-3 text-sm text-white/70">
          <span>{image.category}</span>
          <span>&bull;</span>
          <span>{image.collectionName}</span>
          <span>&bull;</span>
          <span>{new Date(image.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={image._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 mb-16 sm:mb-0"
          onClick={onClose} // clicking outside image closes it
        >
          {index > 0 && (
            <button 
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all z-20 shadow-lg"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img 
            src={image.imageUrl} 
            alt={image.title} 
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
          />

          {index < images.length - 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-2 sm:right-6 p-2 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all z-20 shadow-lg"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LightboxModal;
