import { useState } from 'react';
import Search from './Search';

interface SongSearchFormProps {
  searchTerm: string;
}

const SongSearchForm = () => {
  const [songPrompt, setSongPrompt] = useState('');

  const handleSearch = (searchTerm: SongSearchFormProps) => {
    console.log('searched for', searchTerm);
  };

  const handleSubmit = (searchTerm) => {
    console.log('Called Api', searchTerm);
  };

  return (
    <>
      <Search onSearch={handleSearch} onSubmit={handleSubmit} />
    </>
  );
};

export default SongSearchForm;
