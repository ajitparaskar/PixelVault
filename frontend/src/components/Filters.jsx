const CATEGORIES = ['All', 'Nature', 'City', 'Abstract', 'People', 'Animals'];
const COLLECTIONS = ['All', 'Default', 'Favorites', 'Vacation', 'Work'];

const Filters = ({ category, setCategory, collection, setCollection }) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mr-2 self-center">Category</span>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Collection</span>
        <select 
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          {COLLECTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
