import { useEffect, useRef, useState } from 'react';
import useAutosizeTextArea from '../hooks/useAutoResizeTextArea';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
}

const Search : React.FC<SearchProps> = ({ onSearch, onSubmit }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [examplePrompts] = useState([
    "Songs for a lazy Sunday",
    "Songs for unemployed people"
  ]);

  useEffect(()=>{
    textAreaRef.current?.focus();
  },[])

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

  const selectExamplePrompt = (prompt: string) => {
    // setSearchTerm(prompt);
    // setShowDropdown(false);
    console.log(prompt);
  };

  return (
      <div style={{ position: 'relative' }}>
      <textarea
        className="text-neutral h-[56px] w-full resize-none rounded-md bg-secondary px-4 py-3.5 text-xl font-light shadow-sm outline-0 focus-visible:ring-2 "
        value={searchTerm}
        onChange={handleSearch}
        placeholder="E.g. 'Songs for a lazy Sunday' 'Songs for unemployed people'"
        ref={textAreaRef}
        onKeyDown={handleKeyPress}
      />
      {textAreaRef.current && textAreaRef.current.value.length == 0 && (
        <div id="dropdown-menu" className="bg-gray-200 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-0">
          {examplePrompts.map((prompt, index) => (
            <div className="rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" key={index} onClick={() => selectExamplePrompt(prompt)}>{prompt}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
