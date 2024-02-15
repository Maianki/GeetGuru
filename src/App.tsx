// import { useState } from 'react';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from './services/getPlaylist';
import { useSpotify } from './hooks/useSpotify';
import { Scopes, SearchResults, SpotifyApi } from './utils/spotify/';

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

  const sdk = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID, 
    import.meta.env.VITE_REDIRECT_TARGET, 
    Scopes.userDetails
  );


  console.log(sdk);
  
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
