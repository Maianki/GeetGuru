import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from '../services/getPlaylist';
import Search from './Search';
import { Audio } from 'react-loader-spinner';
import { SpotifyApi, Scopes } from '@spotify/web-api-ts-sdk';
import { Spotify } from "react-spotify-embed";

// interface SongSearchFormProps {
//   searchTerm: string;
// }

const SongSearchForm = () => {
  const [songPrompt, setSongPrompt] = useState<string>('');
  const [tracks, setTracks] = useState<(string | null)[]>([]);

  const sdk = SpotifyApi.withClientCredentials(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_SECRET_ID,
    Scopes.all
  );

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['songPrompt'],
    queryFn: () => getPlaylistFromPrompt(songPrompt),
    staleTime: 60 * 60 * 1000,
    enabled : false,
    select: (data) => {
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          return parsedData.map((track) => `${track.song} by ${track.artist}`);
        }
      }
      return [];
    }
  });

  useEffect(() => {
    (async function () {

      if (data && data.length > 0) {
        try{
          const trackPromises = data.map(async (song) => {
            try{
              const items = await sdk.search(song, ['track']);
              return items.tracks.items[0].id;
            }catch(err){
              return null;
            }
          });
      
          const resolvedTracks = await Promise.all(trackPromises);
          const finalTracks = resolvedTracks.filter(track=> track !== null);
          setTracks(finalTracks);          
        }catch(e){
          // setIstracksError(true);
        }
      }
    })();
  }, [data]);

  const handleSearch = (searchTerm: string) => {
    setSongPrompt(searchTerm);
  };

  const handleSubmit = () => {
    refetch();
  };

  return (
    <>
      <Search onSearch={handleSearch} onSubmit={handleSubmit} />
      <div className="flex justify-center">
      {
        isLoading && <Audio height="100" width="100" color="#4fa94d" ariaLabel="audio-loading" wrapperStyle={{}} wrapperClass="wrapper-class" visible={true} />
      }
        { tracks.length > 0 &&
        <div style={{width:"100%"}}> 
          {tracks.map(track => {
            return <Spotify
              className="mt-3"
              key={track}
              wide
              link={`https://open.spotify.com/track/${track}`} />;
          })}
        </div>
        }
      </div>
    </>
  );
};

export default SongSearchForm;
