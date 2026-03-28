import { Search, Plus } from 'lucide-react';

const Navbar = ({ onUploadClick, search, setSearch }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Gallery<span className="font-light text-slate-400">Pro</span>
            </span>
          </div>
          
          <div className="flex-1 max-w-xl px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 rounded-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-blue-500 transition-shadow outline-none"
              />
            </div>
          </div>
          
          <div>
            <button
              onClick={onUploadClick}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Upload Image</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
