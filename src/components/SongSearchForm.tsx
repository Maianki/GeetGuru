import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from '../services/getPlaylist';
import Search from './Search';
import { Audio } from 'react-loader-spinner';
import { SpotifyApi, Scopes } from '@spotify/web-api-ts-sdk';
import { Spotify } from 'react-spotify-embed';
import Pills from './Pills';
import toast, { Toaster } from 'react-hot-toast';

// interface SongSearchFormProps {
//   searchTerm: string;
// }

const SongSearchForm = () => {
  const [songPrompt, setSongPrompt] = useState<string>('');
  const [tracks, setTracks] = useState<(string | null)[]>([]);
  const [isTrackLoading, isSetTrackLoading] = useState<boolean>(false);

  const sdk = SpotifyApi.withClientCredentials(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_SECRET_ID,
    Scopes.all
  );

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['songPrompt'],
    queryFn: () => getPlaylistFromPrompt(songPrompt),
    staleTime: 60 * 60 * 1000,
    enabled: false,
    select: (data) => {
      console.log(data);
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          console.log('here');
          return parsedData.map((track) => `${track.song} by ${track.artist}`);
        } else {
          console.log('data');
          toast.error(data);
        }
      }
      toast.error(data);

      return [];
    },
  });

  useEffect(() => {
    (async function () {
      if (data && data.length > 0) {
        isSetTrackLoading(true);
        try {
          const trackPromises = data.map(async (song) => {
            try {
              const items = await sdk.search(song, ['track']);
              return items.tracks.items[0].id;
            } catch (err) {
              console.log('item  ERROR');

              return null;
            }
          });

          const resolvedTracks = await Promise.all(trackPromises);
          const finalTracks = resolvedTracks.filter((track) => track !== null);
          setTracks(finalTracks);
          isSetTrackLoading(false);
        } catch (e) {
          // setIstracksError(true);
          isSetTrackLoading(false);
          console.log('trCK ERROR');
        }
      }
    })();
  }, [data]);

  const handleSearch = (searchTerm: string) => {
    setSongPrompt(searchTerm);
  };

  const handleSubmit = () => {
    setTracks([]);
    refetch();
  };

  const handleCreatePlaylist = async () => {
    try {
      const sdk = SpotifyApi.withUserAuthorization(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_ENV === 'DEVELOPMENT'
          ? 'http://localhost:5173/callback'
          : 'https://geetguru.vercel.app/callback',
        Scopes.all
      );

      const user = await sdk.currentUser.profile();
      const user_id = user.id;
      const playlist = await sdk.playlists.createPlaylist(user_id, {
        name: `Geet Guru : ${songPrompt}`,
      });
      const playlistId = playlist.id;
      const uris = tracks.map((track) => `spotify:track:${track}`);
      console.log(tracks);
      await sdk.playlists.addItemsToPlaylist(playlistId, uris as string[]);
      console.log(playlistId);
    } catch (err) {
      console.log();
    }
  };

  return (
    <>
      <Search onSearch={handleSearch} onSubmit={handleSubmit} />
      <div className="mb-3 mt-2 flex flex-wrap gap-2 ">
        <Pills text="Melodies for mischievous kittens" />
        <Pills text="Tunes to survive a zombie apocalypse" />
      </div>
      <div className=" custom-scrollbar flex h-[350px] justify-center overflow-y-auto">
        {(isLoading || isTrackLoading) && (
          <Audio
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        )}
        {tracks.length > 0 && (
          <div style={{ width: '100%' }}>
            {tracks.map((track) => {
              return (
                <Spotify
                  className="mt-3"
                  key={track}
                  wide
                  link={`https://open.spotify.com/track/${track}`}
                />
              );
            })}
          </div>
        )}
      </div>
      {tracks.length > 0 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={handleCreatePlaylist}
            className="mb-2 me-2 mt-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 "
          >
            Create Playlist
          </button>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default SongSearchForm;
