import { useRef, useState } from 'react';
import useAutosizeTextArea from '../hooks/useAutoResizeTextArea';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
}

const Search : React.FC<SearchProps> = ({ onSearch, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const textAreaRef = useRef(null);

  useAutosizeTextArea(textAreaRef.current, searchTerm);

  const handleSearch = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      onSubmit(e.currentTarget.value);
      setSearchTerm('');
    }
  };

  return (
    <textarea
      className="text-neutral h-[56px] w-full resize-none rounded-md bg-secondary px-4 py-3.5 text-xl font-light shadow-sm outline-0 focus-visible:ring-2 "
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search for melodies..."
      ref={textAreaRef}
      onKeyDown={handleKeyPress}
    />
  );
};

export default Search;
