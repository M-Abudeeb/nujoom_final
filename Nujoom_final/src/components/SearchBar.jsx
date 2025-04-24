import { Search } from 'lucide-react';

const SearchBar = () => (
  <div className="flex items-center">
    <Search size={16} className="ml-2" />
    <input 
      type="text" 
      placeholder="البحث عن لاعب..." 
      className="outline-none bg-transparent w-40"
    />
  </div>
);

export default SearchBar; 