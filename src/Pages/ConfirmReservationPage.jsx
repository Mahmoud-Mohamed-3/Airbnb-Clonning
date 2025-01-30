import {Link, useLocation, useParams} from 'react-router-dom';
import NavBar from "../components/NavBar.jsx";
import {useEffect, useState} from "react";
import {GetCurrentUserApi} from "../APIs/User/Current_user.jsx";
import {useCookies} from "react-cookie";
import "../css/confirm_reservation_page.css"
import "../css/confirmReservation_page.css"
import dayjs from "dayjs";
import {GetSinglePropertyApi} from "../APIs/Properties/GetSingleProperty.jsx";
import {StarFilled} from "@ant-design/icons";
import {ReserveApi} from "../APIs/Properties/Reserve.jsx";
import {message} from "antd";

function ConfirmReservationPage() {
  const {property_id} = useParams();
  const location = useLocation();
  const [cookies, setCookie] = useCookies([]);
  const queryParams = new URLSearchParams(location.search);
  const start_date = queryParams.get('start_date');
  const end_date = queryParams.get('end_date');
  const total_price = queryParams.get('total_price');
  const number_of_days = queryParams.get('number_of_days');
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (cookies.jwt) {
      async function fetchUser() {
        if (!cookies.jwt) {
          return;
        }
        const [data, error] = await GetCurrentUserApi(cookies.jwt);
        if (data) {
          setUser(data);
        } else {
          console.log(error);
        }
      }

      fetchUser();
    }
  }, [cookies.jwt]);
  return (

    <>
      <NavBar user={user} setUser={setUser}/>
      <Components start_date={start_date} end_date={end_date} total_price={total_price}
                  number_of_days={number_of_days} property_id={property_id} cookies={cookies.jwt}/>
    </>
  );
}

function Components({start_date, end_date, total_price, number_of_days, property_id, cookies}) {
  return (
    <div className={"MainComponentsContainer"}>
      <div className={"PaymentsContainer"}>
        <LeftSide start_date={start_date} end_date={end_date} total_price={total_price} cookies={cookies}
                  property_id={property_id}/>
        <RightSide start_date={start_date} end_date={end_date} total_price={total_price}
                   number_of_days={number_of_days} property_id={property_id}/>
      </div>
    </div>
  );
}

function LeftSide({start_date, end_date, total_price, cookies, property_id}) {
  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  }// Ensure the date is in dayjs format and then format it
  const formatSubmitDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD"); // Ensure the date is in dayjs format and then format it
  }

  const AddReservation = async (coo) => {
    try {
      const [response, error] = await ReserveApi(cookies, property_id, {
        start_date: formatSubmitDate(start_date),
        end_date: formatSubmitDate(end_date),
        total_price: total_price,

      });
      if (response) {
        message.success("Reservation sending successfully");
      }
      if (error) {
        if (error.message === "Reservation request sent successfully!") {
          message.success("Reservation request sent successfully!");
        } else {
          message.error(error.message);
        }
      }
    } catch (err) {
      console.error("Error sending reservation:", err);
      message.error("Error sending reservation");
    }

  }

  return (
    <div className={"LeftSide"}>
      <div className={"title"}>
        Confirm & Pay
      </div>
      <div className={"date"}>
        <div className={"dateTitle"}>
          Dates
        </div>
        <div className={"dateValue"}>
          {formatDate(start_date)} to {formatDate(end_date)}
        </div>
      </div>

      <div className={"PaymentMethod"}>
        <div className={"paymentTitle"}>
          Payment Method
        </div>
        <div className={"paymentValue"}>
          <div className={"paymentMethod"}>
            <input type="radio" name="paymentMethod" value="creditCard"/>
            <label htmlFor="creditCard">Credit Card</label>
          </div>
          <div className={"paymentMethod"}>
            <input type="radio" name="paymentMethod" value="paypal"/>
            <label htmlFor="paypal">Paypal</label>
          </div>

        </div>
      </div>

      <div className={"rules"}>
        <div className={"rulesTitle"}>
          Rules
        </div>
        <div className={"rulesValue"}>
          <ul>
            <li>Check-in: 2:00 PM</li>
            <li>Check-out: 12:00 PM</li>
            <li>No smoking</li>
            <li>No pets</li>
            <li>No parties or events</li>
          </ul>
        </div>
      </div>

      <div className={"totalPrice"}>
        <div className={"totalPriceTitle"}>
          Total Price
        </div>
        <div className={"totalPriceValue"}>
          {total_price}$
        </div>
      </div>

      <button className={"confirmButton"} onClick={AddReservation}>
        Confirm & Pay
      </button>
    </div>
  )
}

function RightSide({start_date, end_date, total_price, number_of_days, property_id}) {
  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY"); // Ensure the date is in dayjs format and then format it
  };
  const [property, setProperty] = useState(null);
  useEffect(() => {
    async function fetchProperty() {
      const [data, error] = await GetSinglePropertyApi(property_id);
      if (data) {
        setProperty(data);
      } else {
        console.log(error);
      }
    }

    fetchProperty();
  }, [property_id]);

  return (
    <div className={"RightSide"}>
      <div className={"priceCard"}>
        <div className={"chickingInfo"}>
          <div className={"PropertyInfo"}>
            <Link
              to={`/property/${property?.city}/${property?.id}/${property?.owner}/${property?.user_id}`}
            >
              <div className={"Image"}>
                <img src={property?.images[0]} alt={property?.name}/>
              </div>
            </Link>
            <div className={"info"}>
              <div className={"place"}>{property?.city} , {property?.country}</div>
              <div className={"rate"}>
                <StarFilled style={{color: "gold"}}/>
                <span>{property?.property_rate}</span>
              </div>
            </div>
          </div>

          <div className={"ckeckingDates"}>
            <div className={"title"}>Your Reservation</div>

          </div>
          <table>

            <tr>
              <td>
                <span className={"title"}>Check In</span>
                <span className={"value"}>{formatDate(start_date)}</span>
              </td>
              <td>
                <span className={"title"}>Check Out</span>
                <span className={"value"}>{formatDate(end_date)}</span>
              </td>
            </tr>
          </table>
        </div>
        <div className={"priceInfo"}>
          <div>Total</div>
        </div>
        <div className={"totalPriceInfo"}>
          <span> Total price for {number_of_days} Nights</span>
          <span>$ {total_price}</span>
        </div>
      </div>
    </div>
  )
}

export default ConfirmReservationPage;
