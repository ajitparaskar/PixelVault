import Masonry from 'react-responsive-masonry';
import ImageCard from './ImageCard';

const GalleryGrid = ({ images, onImageClick, onDelete }) => {
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p className="text-xl">No images found</p>
      </div>
    );
  }

  // Define breakpoints for columns
  const breakPointsObj = {
    default: 1,
    500: 2,
    768: 3,
    1024: 4
  };

  return (
    <Masonry 
      breakPoints={breakPointsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {images.map((image, idx) => (
        <ImageCard 
          key={image._id} 
          image={image} 
          onClick={() => onImageClick(idx)}
          onDelete={() => onDelete(image._id)}
        />
      ))}
    </Masonry>
  );
};

export default GalleryGrid;
