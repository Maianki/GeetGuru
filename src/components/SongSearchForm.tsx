import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlaylistFromPrompt } from '../services/getPlaylist';
import Search from './Search';
import { Audio, FallingLines } from 'react-loader-spinner';
import { SpotifyApi, Scopes } from '@spotify/web-api-ts-sdk';
import { Spotify } from 'react-spotify-embed';
import Pills from './Pills';
import toast from 'react-hot-toast';

const SongSearchForm = () => {
  const songPromptRef = useRef<string>('');
  const [tracks, setTracks] = useState<(string | null)[]>([]);
  const [isTrackLoading, isSetTrackLoading] = useState<boolean>(false);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState<boolean>(false);

  const sdk = SpotifyApi.withClientCredentials(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_SECRET_ID,
    Scopes.all
  );

  const { isFetching, isLoading, data, refetch } = useQuery({
    queryKey: ['songPrompt'],
    queryFn: () => getPlaylistFromPrompt(songPromptRef.current),
    staleTime: 60 * 60 * 1000,
    enabled: false,
    select: (data) => {
      try{
        if (typeof data === 'string') {
          const parsedData = JSON.parse(data);
          if (Array.isArray(parsedData)) {
            return parsedData.map((track) => `${track.song} by ${track.artist}`);
          }
        }
        return [];
      }catch(err){
        //making typescript happy
        return ["Something went wrong!"];
      }
    
    },
  });

  useEffect(() => {
    (async function () {
      if (data && data.length > 0) {
        isSetTrackLoading(true);
        if (data[0] === "Something went wrong!") {
          toast.error("Invalid input. Please try again.");
          isSetTrackLoading(false);
          return () => {}
        }

        try {
          const trackPromises = data.map(async (song) => {
            try {
              const items = await sdk.search(song, ['track']);
              return items.tracks.items[0].id;
            } catch (err) {
              return null;
            }
          });

          const resolvedTracks = await Promise.all(trackPromises);
          const finalTracks = resolvedTracks.filter((track) => track !== null);
          setTracks(finalTracks);
          isSetTrackLoading(false);
        } catch (e) {
          isSetTrackLoading(false);
          toast.error("Something went wrong!");
        }
      }
    })();
  }, [data]);

  const handleSearch = (searchTerm: string) => {
    songPromptRef.current = searchTerm;
  };

  const handleSubmit = () => {
    setTracks([]);
    refetch();
  };

  const handleCreatePlaylist = async () => {
    setIsPlaylistLoading(true);
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
        name: `Geet Guru : ${songPromptRef.current}`,
      });
      const playlistId = playlist.id;
      const uris = tracks.map((track) => `spotify:track:${track}`);
      await sdk.playlists.addItemsToPlaylist(playlistId, uris as string[]);
      setIsPlaylistLoading(false);
    } catch (err) {
      setIsPlaylistLoading(false);
      console.log();
    }
  };

  return (
    <>
      <Search onSearch={handleSearch} onSubmit={handleSubmit} />
      <div className="mb-3 mt-2 flex flex-wrap gap-2 ">
        <Pills text="Songs for unemployed people" handleClick={handleSearch} handleSubmit={handleSubmit}/>
        <Pills text="Tunes to survive a zombie apocalypse" handleClick={handleSearch} handleSubmit={handleSubmit}/>
      </div>
      <div className=" custom-scrollbar flex h-[350px] justify-center overflow-y-auto">
        {(isLoading || isTrackLoading || isFetching) && (
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
            className="flex items-center mb-2 me-2 mt-2 rounded-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 "
          >
            {isPlaylistLoading ? <><FallingLines width="20" color="#4fa94d" visible={true} /> <span>Create Playlist</span> </> : "Create Playlist"}
          </button> 
        </div>
      )}
    </>
  );
};

export default SongSearchForm;
