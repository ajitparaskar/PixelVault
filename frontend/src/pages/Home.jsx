import React, { useState } from 'react';
import { useImages } from '../hooks/useImages';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import GalleryGrid from '../components/GalleryGrid';
import UploadModal from '../components/UploadModal';
import LightboxModal from '../components/LightboxModal';
import AuthModal from '../components/AuthModal';

const Home = () => {
  const {
      images, loading, loadingMore, hasMore,
      search, setSearch,
      category, setCategory,
      collection, setCollection,
      view, setView,
      loadMore, handleDelete,
      refreshImages
  } = useImages();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({ open: false, index: 0 });

  const openLightbox = (index) => setLightboxData({ open: true, index });
  const closeLightbox = () => setLightboxData({ ...lightboxData, open: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        onUploadClick={() => setIsUploadOpen(true)}
        search={search}
        setSearch={setSearch}
        onLoginClick={() => setIsAuthOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters
          category={category} setCategory={setCategory}
          collection={collection} setCollection={setCollection}
          view={view} setView={setView}
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
                  className="px-8 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 focus:ring-4 focus:ring-blue-100 text-slate-700 font-medium rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-3"
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
          onSuccess={() => {
            setIsUploadOpen(false);
            refreshImages();
          }}
        />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
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
};

export default Home;
