import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-8 mt-10 border-t border-gray-700">
      <div className="container mx-auto text-center">
        {/* Company Name */}
        <h2 className="text-2xl font-semibold flex items-center justify-center space-x-2">
          <span>✈️</span> <span>Trip Travel</span>
        </h2>
        <p className="text-gray-400 mt-2">Your Gateway to the World</p>

        {/* Navigation Links - Well Separated */}
        <div className="mt-6 flex justify-center space-x-8 text-gray-300">
          <Link to="/" className="hover:text-white transition duration-300">
            Home
          </Link>
          <Link
            to="/bookings"
            className="hover:text-white transition duration-300"
          >
            Booking
          </Link>
          <Link
            to="/contact"
            className="hover:text-white transition duration-300"
          >
            Contact
          </Link>
          <Link
            to="/about"
            className="hover:text-white transition duration-300"
          >
            About
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6 mx-auto w-2/3"></div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Trip Travel. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
