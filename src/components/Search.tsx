import { useEffect, useRef, useState } from 'react';
import useAutosizeTextArea from '../hooks/useAutoResizeTextArea';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
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

    console.log(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      onSubmit(e.currentTarget.value);
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
    </div>
  );
};

export default Search;
