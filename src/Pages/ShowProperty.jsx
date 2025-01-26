import "../css/showProperty.css";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GetSinglePropertyApi} from "../APIs/Properties/GetSingleProperty.jsx";
import NavBar from "../components/NavBar.jsx";
import {Carousel, Image, message, Spin} from "antd";
import {GetUserWishlistedProperties} from "../APIs/User/GetUserWishlistedProperties.jsx";
import {useCookies} from "react-cookie";
import {GetCurrentUserApi} from "../APIs/User/Current_user.jsx";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import {AddToWishlistApi} from "../APIs/Wishlist/AddToWishlist.jsx";
import {RemoveFromWishlistApi} from "../APIs/Wishlist/RemoveFromWishlist.jsx";
import {ReserveApi} from "../APIs/Properties/Reserve.jsx";

const ShowProperty = () => {
  const {id} = useParams();
  const [property, setProperty] = useState(null);
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [cookies, setCookie] = useCookies([]);
  useEffect(() => {
    async function fetchProperty() {
      const [data, error] = await GetSinglePropertyApi(id);
      if (data) {
        setProperty(data);
      }
      if (error) {
        console.log(error);
      }
    }

    fetchProperty();
  }, [id]);

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

  useEffect(() => {
    async function fetchWishlistedProperties() {
      if (user) {
        const [data, error] = await GetUserWishlistedProperties(
          user.id,
          cookies.jwt,
        );
        if (data) {
          setWishlistedProperties(data);
        }
        if (error) {
          console.log(error);
        }
      }
    }

    fetchWishlistedProperties();
  });
  const isWishlisted = wishlistedProperties.some(
    (wishlistedProperty) => `${wishlistedProperty.id}` === `${id}`,
  );
  const AddToWishlist = async () => {
    if (!user) {
      return;
    }
    const [data, error] = await AddToWishlistApi(cookies.jwt, id);
    if (data) {
      setWishlistedProperties([...wishlistedProperties, data]);
    }
    if (error) {
      console.log(error);
    }
  };
  const RemoveFromWishlist = async () => {
    if (!user) {
      return;
    }
    const [data, error] = await RemoveFromWishlistApi(cookies.jwt, id);
    if (data) {
      setWishlistedProperties(
        wishlistedProperties.filter(
          (wishlistedProperty) => `${wishlistedProperty.id}` !== `${id}`,
        ),
      );
    }
    if (error) {
      console.log(error);
    }
  };
  if (!property) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size={"large"} spinning={true}/>
      </div>
    );
  }

  return (
    <>
      <NavBar user={user} setUser={setUser}/>
      <Property
        property={property}
        isWishlisted={isWishlisted}
        AddToWishlist={AddToWishlist}
        RemoveFromWishlist={RemoveFromWishlist}
        user={user}
        reserveApi={ReserveApi}
        cookies={cookies}
      />
    </>
  );
};

// eslint-disable-next-line react/prop-types
function Property({
                    // eslint-disable-next-line react/prop-types
                    property,
                    // eslint-disable-next-line react/prop-types
                    isWishlisted,
                    // eslint-disable-next-line react/prop-types
                    RemoveFromWishlist,
                    // eslint-disable-next-line react/prop-types
                    AddToWishlist,
                    user,
                    cookies
                  }) {
  const AddReserve = async (id) => {
    const [data, error] = await ReserveApi(cookies.jwt, id);
    if (data) {
      message.success(data.message || "Reservation successful! Waiting for confirmation.");
    }
    if (error) {
      if (error.message === "Reservation request sent successfully!") {
        message.success(error.message);
      } else {
        message.error(error.message || "You have already reserved this property");
      }
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // Get the day (1-31)
    const month = date.toLocaleString('default', {month: 'short'}); // Get the abbreviated month name (e.g., "Jan")
    const year = date.getFullYear(); // Get the full year (e.g., 2023)
    return `${day} ${month} ${year}`; // Format as "DD MMM YYYY"
  };
  const numberofNights = (start_date, end_date) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  const numberofDays = numberofNights(property.start_date, property.end_date);
  return (
    <div className={"MainComponentsContainer"}>
      <div className={"PropertyContainer"}>
        <div className={"title"}>
          <div className={"PropertyPlace"}>

            {property.type_of_property} in {property.place}
          </div>
          {
            user &&
            <div className={"favOrNot"}>
              {isWishlisted ? (
                <HeartFilled
                  style={{color: "red"}}
                  onClick={() => {

                    RemoveFromWishlist(property.id);
                  }}
                />
              ) : (
                <HeartOutlined
                  onClick={() => {

                    AddToWishlist(property.id);
                  }}
                />
              )}
            </div>
          }

        </div>
        <div className={"ImagesContainer"}>
          <div className={"MainImage"}>
            <Image src={property.images[0]} alt={"Main"}/>
          </div>
          <div className={"Images"}>
            {property.images.map((image, index) => {
              if (index === 0) {
                return;
              }
              return (
                <div
                  className={"ImageContainer"}
                  style={{
                    height: "200px",
                    width: "48%",
                    marginBottom: "14px",
                    overflow: "hidden",
                  }}
                  key={index}
                >
                  <Image key={index} src={image} alt={"Main"}/>
                </div>
              );
            })}
          </div>
        </div>
        <div className={"ImagesCarousel"}>
          <Carousel draggable={true} arrows={true}
                    style={{height: "400px"}}> {/* Use viewport height for responsiveness */}
            {property.images.map((image, index) => {
              return (
                <div key={index} style={{height: "100%", width: "100%"}}>
                  <Image
                    src={image}
                    alt={"Main"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
        <div className={"propertyInfo"}>
          <div className={"leftColumn"}>se</div>
          <div className={"rightColumn"}>
            <div className={"priceCard"}>
              <div className={"price"}>
                <span>$ {property.price}</span> / night
              </div>
              <div className={"chickingInfo"}>
                <table>
                  <tr>
                    <td>
                      <span className={"title"}>Check In</span>
                      <span className={"value"}>{formatDate(property.start_date)}</span>
                    </td>
                    <td>
                      <span className={"title"}>Check Out</span>
                      <span className={"value"}>{formatDate(property.end_date)}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"> {/* Merge cells for the second row */}
                      <span className={"title"}>Guests</span>
                      <span className={"value"}>{property.max_guests}</span>
                    </td>
                  </tr>
                </table>
              </div>
              {user && <button className={"reserve"} onClick={() => {
                AddReserve(property.id);
              }}>
                Reserve
              </button>}
              <div className={"totalPriceInfo"}>
                <span> {property.price} x {numberofDays} Nights</span>
                <span>$ {property.price * numberofDays}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ShowProperty;
