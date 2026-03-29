import { useState, useEffect, useContext, useCallback } from 'react';
import { fetchImages as fetchImagesApi, deleteImage as deleteImageApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export const useImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [collection, setCollection] = useState('All');
  const [view, setView] = useState('public');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { token } = useContext(AuthContext);

  const fetchImages = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = { page: pageNum, limit: 12 };
      if (category !== 'All') params.category = category;
      if (collection !== 'All') params.collectionName = collection;
      if (search) params.search = search;
      if (view) params.view = view;

      const res = await fetchImagesApi(params);
      if (res.data.success) {
        const payload = res.data.data;
        const fetchedImages = Array.isArray(payload) ? payload : payload?.data || [];
        const moreAvailable = typeof res.data.hasMore === 'boolean'
          ? res.data.hasMore
          : Boolean(payload?.hasMore);

        if (append) {
          setImages(prev => [...prev, ...fetchedImages]);
        } else {
          setImages(fetchedImages);
        }
        setHasMore(moreAvailable);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  }, [category, collection, search, view]);

  useEffect(() => {
    if (!token && view !== 'public') {
      setView('public');
      return; 
    }

    setPage(1);
    const debounce = setTimeout(() => {
      fetchImages(1, false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [category, collection, search, view, token, fetchImages]);

  const loadMore = () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await deleteImageApi(id);
      if (res.data.success) {
        setImages((prev) => prev.filter((img) => img._id !== id));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  return {
    images, loading, loadingMore, hasMore,
    search, setSearch,
    category, setCategory,
    collection, setCollection,
    view, setView,
    loadMore, handleDelete,
    refreshImages: () => { setPage(1); fetchImages(1, false); }
  };
};
