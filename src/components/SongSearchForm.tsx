import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from '../services/getPlaylist';
import Search from './Search';
import { Audio } from 'react-loader-spinner';
import { SpotifyApi, Scopes } from '@spotify/web-api-ts-sdk';
import { Spotify } from "react-spotify-embed";

interface SongSearchFormProps {
  searchTerm: string;
}

const SongSearchForm = () => {
  const [songPrompt, setSongPrompt] = useState<string>('');
  const [tracks, setTracks] = useState<string[]>([]);
  const [isTracks, setIstracks] = useState<boolean>(false);

  const sdk = SpotifyApi.withClientCredentials(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_SECRET_ID,
    Scopes.all
  );

  const { isPending, isLoading, error, data, refetch } = useQuery({
    queryKey: ['songPrompt'],
    queryFn: () => getPlaylistFromPrompt(songPrompt),
    staleTime: 60 * 60 * 1000,
    enabled : false,
    select: (data) => {
      console.log(data);
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          return parsedData.map((track) => `${track.song} by ${track.artist}`);
        }
      }
      return [];
    },
  });

  useEffect(() => {
    (async function () {
      if (data && data.length > 0) {
        setIstracks(true);
        data.forEach(async (song) => {
          try {
            const items = await sdk.search(song, ['track']);
            const track = items.tracks.items[0].id;
            console.table({href : items.tracks.items[0].href, uri: items.tracks.items[0].uri, name: items.tracks.items[0].name, track : items.tracks.items[0].id});
            setTracks(prevTracks => [...prevTracks, track]);
            setIstracks(false);
          } catch (error) {
            console.error("Error occurred while searching:", error);
            setIstracks(false);
          }
        });
      }
    })();
  }, [data]);

  const handleSearch = (searchTerm: string) => {
    setSongPrompt(searchTerm);
  };

  const handleSubmit = () => {
    refetch();
  };

  console.log(data);

  return (
    <>
      <Search onSearch={handleSearch} onSubmit={handleSubmit} />
      <div className="flex justify-center">
      {
        isLoading && <Audio height="100" width="100" color="#4fa94d" ariaLabel="audio-loading" wrapperStyle={{}} wrapperClass="wrapper-class" visible={true} />
      }
        <div>
          {tracks.length > 0 && tracks.map(track => {
            return <Spotify
              className="mt-8"
              wide
              link={`https://open.spotify.com/track/${track}`} />;
          })}
        </div>
      </div>
    </>
  );
};

export default SongSearchForm;
