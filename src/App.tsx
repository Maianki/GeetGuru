import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';

function App() {
 

  // const sdk = useSpotify(
  //   import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  //   import.meta.env.VITE_REDIRECT_TARGET,
  //   Scopes.userDetails
  // );

  // console.log(sdk);

  // if (isPending) return 'Loading...';

  // if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      {/* <h1>Geet Guru</h1>
      <ul>
        {data.map((track) => {
          return (
            <li key={track} style={{ textAlign: 'left' }}>
              {track}
            </li>
          );
        })}
      </ul> */}
      <Home />
    </>
  );
}

export default App;
