import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />

        {/* Content should take available space before the footer */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Booking />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        {/* Footer should always be at the bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
