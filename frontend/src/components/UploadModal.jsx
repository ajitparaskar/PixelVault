import { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../context/AuthContext';
import { uploadImage } from '../services/api';
import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ['Uncategorized', 'Nature', 'City', 'Abstract', 'People', 'Animals'];
const COLLECTIONS = ['Default', 'Favorites', 'Vacation', 'Work'];

const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [collection, setCollection] = useState(COLLECTIONS[0]);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);

  const onDrop = useCallback(acceptedFiles => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      // Create preview
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      // Default title to file name
      if (!title) {
        setTitle(selected.name.split('.')[0]);
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('collectionName', collection);
    formData.append('visibility', visibility);

    try {
      const res = await uploadImage(formData);
      if (res.data.success) {
        onSuccess(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl flex flex-col z-10 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Upload New Image</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}
              ${preview ? 'hidden' : 'block'}
            `}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-600 font-medium text-lg">
              {isDragActive ? "Drop image here..." : "Drag & drop an image, or click to browse"}
            </p>
            <p className="text-slate-400 text-sm mt-2">JPG, PNG, WEBP, GIF up to 10MB</p>
          </div>

          {preview && (
            <div className="relative mb-6 rounded-xl overflow-hidden group">
              <img src={preview} alt="Preview" className="w-full h-auto max-h-64 object-contain bg-slate-900" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium backdrop-blur-md"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}

          <form id="upload-form" onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your image a title"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Collection</label>
                <select 
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visibility</label>
                <select 
                  value={visibility}
                  onChange={e => setVisibility(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="upload-form"
            disabled={!file || loading}
            className={`px-5 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-all shadow-sm
              ${(!file || loading) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
