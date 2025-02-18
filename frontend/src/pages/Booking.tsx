import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample flight data (for now, will be replaced with API calls later)
const sampleFlights = [
  {
    flightId: "FL123",
    airline: "Airline 1",
    departure: "2024-07-01 10:00 AM",
    destination: "New York",
    date: "2024-07-01",
    price: 100,
    seatsAvailable: 50,
  },
  {
    flightId: "FL456",
    airline: "Airline 2",
    departure: "2024-07-02 12:00 PM",
    destination: "London",
    date: "2024-07-02",
    price: 150,
    seatsAvailable: 30,
  },
  {
    flightId: "FL789",
    airline: "Airline 3",
    departure: "2024-07-05 08:00 AM",
    destination: "Paris",
    date: "2024-07-05",
    price: 200,
    seatsAvailable: 20,
  },
];

const Booking = () => {
  const [role, setRole] = useState<string | null>("user"); // Temporary role, replace with actual auth
  const [selectedFlight, setSelectedFlight] = useState<string>("");
  const [seats, setSeats] = useState<number>(1);
  const [userId, setUserId] = useState("USR001"); // Temporary userId, replace with actual
  const [flights, setFlights] = useState<any[]>([]); // Flights data to display
  const [bookings, setBookings] = useState<any[]>([]); // Store bookings locally for UI
  const [status, setStatus] = useState<string>("pending"); // Booking status
  const [destination, setDestination] = useState<string>(""); // Destination search
  const [date, setDate] = useState<string>(""); // Date search
  const navigate = useNavigate();

  // Fetch available flights for users (simulated for now)
  useEffect(() => {
    // Here you'd make an API call to get flights
    setFlights(sampleFlights);

    // Temporary role assignment; replace with actual user role check
    setRole("user"); // Change to "admin" for admin role
  }, []);

  // Handle flight search
  const handleSearch = () => {
    const filteredFlights = sampleFlights.filter(
      (flight) =>
        (destination ? flight.destination === destination : true) &&
        (date ? flight.date === date : true)
    );
    setFlights(filteredFlights);
  };

  // Handle booking submission
  const handleBookFlight = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate booking and add to the booking list
    const newBooking = {
      _id: Math.random().toString(36).substr(2, 9),
      flightId: selectedFlight,
      userId: userId,
      seatsBooked: seats,
      status: status,
    };
    setBookings([...bookings, newBooking]);
    setSelectedFlight(""); // Reset selected flight
    setSeats(1); // Reset seats

    // Ideally, here you'd make an API call to book the flight
    // const response = await fetch('/api/bookings', { method: 'POST', body: bookingData });
  };

  // Handle cancel booking (admin or user)
  const handleCancelBooking = async (bookingId: string) => {
    const updatedBookings = bookings.filter(
      (booking) => booking._id !== bookingId
    );
    setBookings(updatedBookings);

    // Here you'd make an API call to cancel the booking
    // const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Available Flights</h2>

      {/* Search Flights */}
      <div className="mb-6 bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Search Flights</h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            placeholder="Destination"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Search Flights
          </button>
        </form>
      </div>

      {/* Admin: Manage Bookings */}
      {role === "admin" && (
        <div className="mb-6 bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Manage Bookings</h3>
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <div key={booking._id} className="p-4 bg-gray-800 rounded-lg">
                  <p>
                    <strong>Flight ID:</strong> {booking.flightId}
                  </p>
                  <p>
                    <strong>User ID:</strong> {booking.userId}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                  <p>
                    <strong>Seats Booked:</strong> {booking.seatsBooked}
                  </p>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Cancel Booking
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No bookings found.</p>
            )}
          </div>
        </div>
      )}

      {/* User: Book Flight */}
      {role === "user" && (
        <div className="mb-6 bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Book a Flight</h3>
          <form onSubmit={handleBookFlight} className="space-y-4">
            <select
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={selectedFlight}
              onChange={(e) => setSelectedFlight(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Flight
              </option>
              {flights.map((flight: any) => (
                <option key={flight.flightId} value={flight.flightId}>
                  {flight.airline} - {flight.flightId} - ${flight.price} -{" "}
                  {flight.seatAvailable} Seats Available
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Seats"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              min="1"
              max="50"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Book Flight
            </button>
          </form>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking: any) => (
              <div key={booking._id} className="p-4 bg-gray-800 rounded-lg">
                <p>
                  <strong>Flight ID:</strong> {booking.flightId}
                </p>
                <p>
                  <strong>User ID:</strong> {booking.userId}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p>
                  <strong>Seats Booked:</strong> {booking.seatsBooked}
                </p>
                {role === "user" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
