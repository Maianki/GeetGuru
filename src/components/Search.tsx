import { useEffect, useRef, useState } from 'react';
// import { TbMusicSearch } from "react-icons/tb";
import useAutosizeTextArea from '../hooks/useAutoResizeTextArea';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onSubmit: () => void;
}

const Search: React.FC<SearchProps> = ({ onSearch, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useAutosizeTextArea(textAreaRef.current, searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      onSubmit();
      setSearchTerm('');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        className="h-[56px] w-full resize-none rounded-md bg-secondary px-4 py-3.5 text-xl font-light text-neutral shadow-sm outline-0 placeholder:text-neutral/50 focus-visible:ring-2"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Songs for a lazy Sunday"
        ref={textAreaRef}
        onKeyDown={handleKeyPress}
      />
      <button
      className="flex items-center"
      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: '.8', color : "#FEE3BC" }}
      onClick={onSubmit}
    >
      Search
      {/* <TbMusicSearch />  */}
    </button>
    </div>
  );
};

export default Search;
