import "../css/showProperty.css";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GetSinglePropertyApi} from "../APIs/Properties/GetSingleProperty.jsx";
import NavBar from "../components/NavBar.jsx";
import {Avatar, Carousel, Image, message, Spin} from "antd";
import {GetUserWishlistedProperties} from "../APIs/User/GetUserWishlistedProperties.jsx";
import {useCookies} from "react-cookie";
import {GetCurrentUserApi} from "../APIs/User/Current_user.jsx";
import {CalendarOutlined, HeartFilled, HeartOutlined, KeyOutlined, SketchOutlined, StarFilled} from "@ant-design/icons";
import {AddToWishlistApi} from "../APIs/Wishlist/AddToWishlist.jsx";
import {RemoveFromWishlistApi} from "../APIs/Wishlist/RemoveFromWishlist.jsx";
import {ReserveApi} from "../APIs/Properties/Reserve.jsx";
import {GetPropertyOwnerApi} from "../APIs/User/GetPropertyOwner.jsx";


const ShowProperty = () => {
  const {id} = useParams();
  const [property, setProperty] = useState(null);
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [cookies, setCookie] = useCookies([]);
  const [propertyOwner, setPropertyOwner] = useState(null);
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

  useEffect(() => {
    async function fetchOwner() {
      if (property) {
        const [data, error] = await GetPropertyOwnerApi(property.user_id);
        if (data) {
          setPropertyOwner(data);
        }
        if (error) {
          console.log(error);
        }
      }
    }

    fetchOwner();
  }, [property]);
  console.log(propertyOwner)
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
        propertyOwner={propertyOwner}
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
                    cookies,
                    propertyOwner,
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
  console.log(property)
  const numberofDays = numberofNights(property.start_date, property.end_date);
  const cancellationDate = new Date(property.start_date);
  cancellationDate.setDate(cancellationDate.getDate() - 10);
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
          <div className={"leftColumn"}>
            <div className={"UpperInfo"}>
              <div className={"title"}>
                {property.type_of_property} in {property.place} , {property.country}
              </div>
              <div className={"HostsInfo"}>
                {property.max_guests} guests .  &nbsp; {property.baths} baths
                .    &nbsp; {property.beds} beds
                . &nbsp; {property.bedrooms} bed rooms
              </div>
              <div className={"rating"}>
                <StarFilled/>{property.property_rate}
                <span> {property.num_of_reviews} reviews</span>
              </div>
            </div>
            <div className={"HosterInfo"}>
              <div className={"OwnerImage"}>
                {
                  propertyOwner && <Avatar
                    src={propertyOwner.profile_image_url}
                    size={40}
                    style={{backgroundColor: "#f56a00", cursor: "pointer"}}
                  />

                }

              </div>
              <div className={"OwnerInfo"}>
                <div className={"name"}>
                  {propertyOwner && propertyOwner.first_name} {propertyOwner && propertyOwner.last_name}
                </div>
                <div className={"description"}>
                  Superhost &nbsp;. 10 years hosting
                </div>
              </div>
            </div>
            <div className={"ProcessRating"}>
              <div>
                <div className={"icon"}>
                  <KeyOutlined/>
                </div>
                <div className={"data"}>
                  <div className={"header"}>
                    Exceptional check-in experience
                  </div>
                  <div className={"details"}>Recent guests gave the check-in process a {property.property_rate}-star
                    rating.
                  </div>
                </div>
              </div>
              <div>
                <div className={"icon"}>
                  <SketchOutlined/>
                </div>
                <div className={"data"}>
                  <div className={"header"}>
                    {
                      propertyOwner && `${propertyOwner.first_name} is a Superhost`
                    }
                  </div>
                  <div className={"details"}>
                    Superhosts are experienced, highly rated Hosts.
                  </div>
                </div>
              </div>
              <div>
                <div className={"icon"}>
                  <CalendarOutlined/>
                </div>
                <div className={"data"}>
                  <div className={"header"}>
                    Free cancellation before {formatDate(cancellationDate)}
                  </div>
                  <div className={"details"}>
                    Get a full refund if you change your mind.
                  </div>
                </div>
              </div>
            </div>

            <div className={"description"}>
              {property.description}
            </div>
            <div className={"BedRooms"}>
              <div className={"title"}>
                Where you’ll sleep
              </div>
              <div className={"BedRoomsContainer"}>
                {
                  Array.from({length: property.bedrooms}, (_, i) => (
                    <div className="BedRoom" key={i}>
                      <div className={"card"}>
                        <div className={"icon"}>
                          <svg fill="#000000" height="50px" width="50px" version="1.1" id="Layer_1"
                               xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                               viewBox="0 0 511.998 511.998" xml:space="preserve">
<g>
	<g>
		<path d="M235.561,335.822c-15.536,0-28.138-12.183-28.746-27.641c-0.253-6.419-0.302-12.887-0.119-19.576h-81.239
			c3.829-4.03,6.193-9.464,6.193-15.461c0-12.409-10.059-22.468-22.468-22.468h-0.313c15.053-3.356,26.432-16.645,26.728-32.747
			c0.347-18.884-14.682-34.475-33.567-34.821c-18.884-0.347-34.475,14.682-34.821,33.566c-0.303,16.526,11.168,30.529,26.694,34.002
			H52.657V136.21c0-6.283-5.093-11.376-11.376-11.376H11.376C5.093,124.834,0,129.927,0,136.21l0.199,219.577
			c0,7.755,6.288,14.043,14.043,14.043h24.474v8.229c0,5.028,4.076,9.104,9.104,9.104h45.669c5.028,0,9.104-4.076,9.104-9.104
			v-8.229H408.25v8.229c0,5.028,4.076,9.104,9.104,9.104h45.669c5.028,0,9.104-4.076,9.104-9.104v-8.229h21.509
			c7.755,0,14.043-6.288,14.043-14.043v-20.156C458.447,335.663,252.037,335.822,235.561,335.822z"/>
	</g>
</g>
                            <g>
	<g>
		<path d="M320.098,214.364c-0.001-0.001-0.002-0.003-0.003-0.004c-4.804-7.754-15.006-10.108-22.711-5.337
			c-0.001,0-0.002,0.001-0.003,0.002l-48.526,30.055l-57.053-26.148l26.78,4.723c4.175-12.724,8.895-23.192,13.237-31.378
			l-62.089-1.14c-12.892-0.236-23.294,10.163-23.523,22.674l-0.756,41.192c-0.231,12.712,10.003,23.292,22.677,23.524l39.412,0.723
			c0.212-2.548,0.457-5.052,0.732-7.511l-28.126-21.845c0.247,0.114,63.004,28.875,63.004,28.875
			c4.798,2.198,10.74,2.012,15.561-0.974l56.047-34.714C322.536,232.265,324.881,222.086,320.098,214.364z"/>
	</g>
</g>
                            <g>
	<g>
		<path d="M463.476,208.226c-62.726-18.113-164.001-31.505-201.971-30.431c0,0-12.598,14.513-22.559,43.451l6.706,1.182
			l43.387-26.873c14.998-9.289,34.99-4.931,44.525,10.466c9.365,15.118,4.772,35.091-10.466,44.526l-56.047,34.714
			c-13.218,8.188-27.946,4.425-33.623,0.017l-5.883-4.569c-0.503,8.387-0.643,17.255-0.272,26.666
			c0.175,4.45,3.831,7.971,8.285,7.971H497.76c4.068,0,7.537-2.95,8.189-6.965l5.294-32.56
			C516.415,244.021,494.427,217.163,463.476,208.226z"/>
	</g>
</g>
</svg>
                        </div>
                        <div className="roomName">
                          Bedroom {i + 1}
                        </div>
                        
                      </div>

                    </div>
                  ))
                }
              </div>
            </div>
          </div>
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
