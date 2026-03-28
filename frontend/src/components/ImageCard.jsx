import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageCard = ({ image, onClick, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <img 
        src={image.imageUrl} 
        alt={image.title} 
        className="w-full h-auto object-cover transform min-h-[100px] group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-medium text-lg truncate">{image.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-white/80 text-xs px-2 py-1 bg-white/20 rounded-md backdrop-blur-sm">
            {image.category}
          </span>
          <span className="text-white/60 text-xs text-right">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          title="Delete image"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ImageCard;
