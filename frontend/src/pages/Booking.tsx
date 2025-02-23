import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080/api";

const Booking = () => {
  const [role, setRole] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Admin Flight Management
  const [airline, setAirline] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [departure, setDeparture] = useState<string>("");
  const [adminDestination, setAdminDestination] = useState<string>("");
  const [adminDate, setAdminDate] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [seatAvailable, setSeatAvailable] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchFlights();
    fetchBookings();
  }, []);

  // Fetch Flights
  const fetchFlights = () => {
    axios
      .get(`${API_URL}/flights/search`, { params: { destination, date } })
      .then((response) => setFlights(response.data))
      .catch((error) => console.error("Error fetching flights:", error));
  };

  // Fetch User Bookings
  const fetchBookings = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  };

  // Handle Add Flight (Admin)
  const handleAddFlight = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${API_URL}/flights`,
        {
          airline,
          flightNumber,
          departure,
          destination: adminDestination,
          date: adminDate,
          price,
          seatAvailable,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchFlights();
        alert("Flight added successfully!");
      })
      .catch((error) => console.error("Error adding flight:", error));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Flight Booking System
      </h2>

      {/* Admin Flight Management */}
      {role === "admin" && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Flight</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Airline"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
            />
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Flight Number"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Departure City"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
            <input
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Destination City"
              value={adminDestination}
              onChange={(e) => setAdminDestination(e.target.value)}
            />
            <input
              type="date"
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              value={adminDate}
              onChange={(e) => setAdminDate(e.target.value)}
            />
            <input
              type="number"
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
              type="number"
              className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
              placeholder="Seats Available"
              value={seatAvailable}
              onChange={(e) => setSeatAvailable(Number(e.target.value))}
            />
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg mt-4"
            onClick={handleAddFlight}
          >
            Add Flight
          </button>
        </div>
      )}

      {/* Flight Search */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Search Flights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            className="p-2 bg-gray-900 border border-gray-700 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            onClick={fetchFlights}
          >
            Search Flights
          </button>
        </div>
      </div>

      {/* Flights List */}
      {flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight._id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <p>
              <strong>Airline:</strong> {flight.airline}
            </p>
            <p>
              <strong>Flight Number:</strong> {flight.flightNumber}
            </p>
            <p>
              <strong>Departure:</strong> {flight.departure}
            </p>
            <p>
              <strong>Destination:</strong> {flight.destination}
            </p>
            <p>
              <strong>Price:</strong> ${flight.price}
            </p>
            <p>
              <strong>Seats Available:</strong> {flight.seatAvailable}
            </p>
            {role === "admin" && (
              <button
                className="bg-red-600 py-2 px-4 mt-2 rounded-lg"
                onClick={() => handleDeleteFlight(flight._id)}
              >
                Delete Flight
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No flights found.</p>
      )}
    </div>
  );
};

export default Booking;
