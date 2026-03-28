import { useState, useEffect, useContext } from 'react';
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

  const fetchImages = async (pageNum = 1, append = false) => {
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
    if (!token && view !== 'public') {
      setView('public');
      return; 
    }

    setPage(1);
    const debounce = setTimeout(() => {
      fetchImages(1, false);
    }, 300);
    return () => clearTimeout(debounce);
  }, [category, collection, search, view, token]);

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
        setImages(images.filter(img => img._id !== id));
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
