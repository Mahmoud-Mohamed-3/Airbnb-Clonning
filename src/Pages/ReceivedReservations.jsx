import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {GetOwnerReservationsApi} from "../APIs/User/GetUserReservations.jsx";
import "../css/received_reservations.css";
import defaultImage from "../assets/balnk_user.png";
import {ConfirmReservationApi} from "../APIs/Properties/ConfirmReservation.jsx";
import {message} from "antd";

export default function ReceivedReservations() {
  const [reservations, setReservations] = useState([]);
  const [cookies] = useCookies([]);

  useEffect(() => {
    async function fetchReservations() {
      if (cookies.jwt) {
        const [data, error] = await GetOwnerReservationsApi(cookies.jwt);
        if (data) {
          setReservations(data);
        }
        if (error) {
          console.log(error);
          // Optionally, display an error message to the user
        }
      }
    }

    fetchReservations();
  }, [cookies.jwt]);
  const Response = async (id, status) => {
    const [response, error] = await ConfirmReservationApi(cookies.jwt, id, {status: status});
    if (response) {
      message.success(response.message || "Reservation successful! Waiting for confirmation.");
    } else {
      console.log(error.message)
      message.error(error.message || "An error occurred. Please try again.");
    }
  }
  const handleConfirm = (reservationId) => {
    message.success("Reservation confirmed");
    Response(reservationId, "approved");
  };

  const handleReject = (reservationId) => {
    message.success("Reservation rejected");
    Response(reservationId, "rejected");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    // Add logic to reject the reservation (e.g., make an API call)
  };

  return (
    <div className="MainReceivedReservationsContainer">
      <div className="ReceivedReservationsContainer">
        <h1>Received Reservations</h1>
        <div className="ReceivedReservations">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="ReceivedReservation">
              <div className="UserImage">
                <img
                  src={reservation.user.profile_image_url || defaultImage}
                  alt="User"
                />
              </div>
              <div className="ReservationDetails">
                <h3>
                  {reservation.user.first_name} {reservation.user.last_name}
                </h3>
                <p>
                  <strong>Property:</strong> {reservation.property.city},{" "}
                  {reservation.property.country}
                </p>
                <p>
                  <strong>Price:</strong> ${reservation.property.price}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(reservation.property.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {reservation.status}
                </p>
              </div>
              <div className="ReservationActions">
                <button onClick={() => handleConfirm(reservation.id)}>
                  Confirm
                </button>
                <button onClick={() => handleReject(reservation.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}