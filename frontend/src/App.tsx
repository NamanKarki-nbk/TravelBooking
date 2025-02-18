import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<h1>Flights Page</h1>} />
          <Route path="/login" element={<h1>Flights Page</h1>} />
          <Route path="/signup" element={<h1>Flights Page</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
