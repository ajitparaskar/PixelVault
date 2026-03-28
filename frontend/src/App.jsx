import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import GalleryGrid from './components/GalleryGrid';
import UploadModal from './components/UploadModal';
import LightboxModal from './components/LightboxModal';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [collection, setCollection] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [lightboxData, setLightboxData] = useState({ open: false, index: 0 });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/images';

  const fetchImages = async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `${API_URL}?page=${pageNum}&limit=12&`;
      if (category !== 'All') url += `category=${category}&`;
      if (collection !== 'All') url += `collectionName=${collection}&`;
      if (search) url += `search=${search}`;

      const res = await axios.get(url);
      if (res.data.success) {
        if (append) {
          setImages(prev => [...prev, ...res.data.data]);
        } else {
          setImages(res.data.data);
        }
        setHasMore(res.data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    const debounce = setTimeout(() => {
      fetchImages(1, false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [category, collection, search]);

  const loadMore = () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      if (res.data.success) {
        setImages(images.filter(img => img._id !== id));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  const openLightbox = (index) => {
    setLightboxData({ open: true, index });
  };

  const closeLightbox = () => {
    setLightboxData({ ...lightboxData, open: false });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onUploadClick={() => setIsUploadOpen(true)}
        search={search}
        setSearch={setSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters
          category={category} setCategory={setCategory}
          collection={collection} setCollection={setCollection}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <GalleryGrid
              images={images}
              onImageClick={openLightbox}
              onDelete={handleDelete}
            />

            {hasMore && (
              <div className="flex justify-center mt-12 mb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 focus:ring-4 focus:ring-blue-100 text-slate-700 font-medium rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading...
                    </>
                  ) : 'Load More Images'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          apiUrl={API_URL}
          onSuccess={() => {
            setIsUploadOpen(false);
            setPage(1);
            fetchImages(1, false);
          }}
        />
      )}

      {lightboxData.open && (
        <LightboxModal
          images={images}
          currentIdx={lightboxData.index}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}

export default App;
