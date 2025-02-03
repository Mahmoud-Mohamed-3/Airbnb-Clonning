import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useOutletContext} from "react-router-dom";
import {message} from "antd";
import {ConfirmReservationApi} from "../APIs/Properties/ConfirmReservation.jsx";
import "../css/received_reservations.css";

export default function ReceivedReservations() {
  const [reservations, setReservations] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const {UserProfile, setUserProfile} = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (UserProfile && UserProfile.user_received_reservations) {
      setReservations(UserProfile.user_received_reservations);
      setLoading(false);
    } else {
      setLoading(false);
      setError("User profile or reservations are not available.");
    }
  }, [UserProfile]);

  useEffect(() => {
    if (cookies.jwt) {

      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile/received_reservations; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);

  const handleResponse = async (id, status) => {
    if (!cookies.jwt) {
      message.error("Authentication error: Token missing. Please log in again.");
      return;
    }

    if (loading || !id) {
      message.error("Data is still loading or reservation ID is missing.");
      return;
    }

    try {
      const [response, error] = await ConfirmReservationApi(cookies.jwt, id, {status});
      if (response) {
        message.success(response.message || `Reservation ${status}!`);
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.id === id ? {...reservation, status} : reservation
          )
        );
        window.location.reload();
      } else {
        throw new Error(error?.message || "An error occurred while updating reservation.");

      }
    } catch (error) {
      console.error("Error confirming reservation:", error);
      window.location.reload();
      message.error(error.message || "An error occurred. Please try again.");
    }
  };
  const handleConfirm = (id) => handleResponse(id, "approved");
  const handleReject = (id) => handleResponse(id, "rejected");

  if (reservations.length === 0) {
    return (
      <div style={{
        width: "80%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: '10px'
      }}>
        <svg width="300px" height="300px" viewBox="0 0 1024 1024" className="icon" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M503.53152 344.4224m-262.5024 0a262.5024 262.5024 0 1 0 525.0048 0 262.5024 262.5024 0 1 0-525.0048 0Z"
            fill="#F2FAFE"/>
          <path
            d="M279.42912 725.46304v-0.04096l-3.47136 0.04096C164.33152 725.46304 73.6256 636.68224 71.71072 526.4384L71.68 522.9056C71.68 411.0336 163.14368 320.33792 275.968 320.33792c102.912 0 188.04736 75.4688 202.20928 173.62944h4.47488v-1.36192c0-127.32416 103.04512-230.77888 230.94272-232.83712l3.8912-0.03072C847.17568 259.7376 952.32 364.00128 952.32 492.5952c0 128.6144-105.14432 232.86784-234.83392 232.86784l2.60096-0.03072v0.03072H279.43936z"
            fill="#DFF1FB"/>
        </svg>
        <h1 style={{fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"}}>No Received
          Reservations</h1>
      </div>
    );
  }
  return (
    <div className="MainReceivedReservationsContainer">
      <div className="ReceivedReservationsContainer">
        <h1>Received Reservations</h1>
        <div className="ReceivedReservations">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="ReceivedReservation">
              <div className="UserImage">

                <img src={reservation.user_profile_image || defaultImage} alt="User"/>
              </div>
              <div className="ReservationDetails">
                <h3>{reservation.user_first_name} {reservation.user_last_name}</h3>
                <p><strong>Property:</strong> {reservation.city}, {reservation.country}</p>
                <p><strong>Price:</strong> ${reservation.total_price}</p>
                <p><strong>Start Date:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {reservation.status}</p>
              </div>
              <div className="ReservationActions">
                <button onClick={() => handleConfirm(reservation.id)}>Confirm</button>
                <button onClick={() => handleReject(reservation.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
