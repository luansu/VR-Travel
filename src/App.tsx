import Background from "./components/Background";
import { NavBar } from "./components/NavBar";
import Home from "./pages/Home";
import { Library } from "./pages/Library";
import { Restrucion } from "./pages/Restrucion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col items-center justify-center gap-2">
        <NavBar />
        <Background />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="res" element={<Restrucion />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
