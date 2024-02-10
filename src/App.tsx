// import { useState } from 'react';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from './services/getPlaylist';

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
    getPlaylistFromPrompt('Songs for unemployed people'),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <h1>Geet Guru</h1>
      <p>{JSON.stringify(data)}</p>
    </>
  );
}

export default App;
