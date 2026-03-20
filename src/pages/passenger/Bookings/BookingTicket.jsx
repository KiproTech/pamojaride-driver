// import React from "react";
// import logo from "../../../assets/images/Pamojaride.png";
// import "./Bookings.css";

// const BookingTicket = ({ ticket }) => {
//   if (!ticket) return null;

//   // Clean text function
//   const cleanText = (text) => text.replace(/[!']/g, "");

//   const formattedDate = new Date(ticket.departure_datetime).toLocaleDateString();
//   const formattedTime = new Date(ticket.departure_datetime).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   // Define routeText for JSX
//   const routeText = `${cleanText(ticket.from)} → ${cleanText(ticket.to)}`;
//   const seats = ticket.seats_booked?.join(", ") || "N/A";

//   return (
//     <div className="booking-ticket boarding-pass">
//       <div className="ticket-header">
//         <img src={logo} alt="PamojaRide Logo" className="ticket-logo" />
//         <h4>🎫 Boarding Pass</h4>
//         <span className="ticket-id">PR-{ticket.booking_id}</span>
//       </div>

//       <div className="ticket-body">
//         <div className="trip-info">
//           <p><strong>Route:</strong> {routeText}</p>
//           <p><strong>Passenger:</strong> User</p>
//           <p><strong>Date:</strong> {formattedDate}</p>
//           <p><strong>Seats:</strong> {seats}</p>
//           <p><strong>Time:</strong> {formattedTime}</p>
//           <p><strong>Amount:</strong> Ksh {ticket.amount}</p>
//           <p><strong>Driver:</strong> {ticket.driver_name} ({ticket.driver_phone})</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingTicket;