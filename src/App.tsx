// import { useState } from 'react';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from './services/getPlaylist';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

function App() {

  // const [tracks, setTracks] = useState<string[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
    getPlaylistFromPrompt('Songs for unemployed people'),
    staleTime : 60 * 60 * 1000,
    select : (data)=>{
      console.log(data)
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        // setTracks(parsedData);
        if (Array.isArray(parsedData)) {
          return parsedData.map(track => `${track.song} by ${track.artist}`);
        }
      }
      return []; 
    }
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <h1>Geet Guru</h1>
      <ul>{data.map((track)=>{
        return <li key={track} style={{textAlign: "left"}}>{track}</li>
      })}</ul>
    </>
  );
}

export default App;
