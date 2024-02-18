import Home from './pages/Home.tsx';
import Chai from './images/chai.svg';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
    <a className="fixed top-4 right-6 z-50" href="https://www.buymeacoffee.com/ankitkumain" target="_blank">
      <button className="rounded-md px-4 py-2 flex" style={{backgroundColor: "rgb(224, 114, 104)", color: "rgb(0, 0, 0)"}}>
        <div className="flex">
            <span className="btn-icon px-1">
              <img src={Chai} alt="Chai icon" />
            </span>
            <span className="btn-custom-text">Buy us a chai</span>
      </div>
      </button>
      </a>
      {/* <Home /> */}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
