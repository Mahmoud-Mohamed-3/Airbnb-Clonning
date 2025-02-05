import "../css/showProperty.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GetSinglePropertyApi} from "../APIs/Properties/GetSingleProperty.jsx";
import NavBar from "../components/NavBar.jsx";
import {Avatar, Button, Carousel, DatePicker, Image, message, Modal, Rate, Spin} from "antd";
import {GetUserWishlistedProperties} from "../APIs/User/GetUserWishlistedProperties.jsx";
import {useCookies} from "react-cookie";
import {GetCurrentUserApi} from "../APIs/User/Current_user.jsx";
import {CalendarOutlined, HeartFilled, HeartOutlined, KeyOutlined, SketchOutlined, StarFilled} from "@ant-design/icons";
import {AddToWishlistApi} from "../APIs/Wishlist/AddToWishlist.jsx";
import {RemoveFromWishlistApi} from "../APIs/Wishlist/RemoveFromWishlist.jsx";
import {GetPropertyOwnerApi} from "../APIs/User/GetPropertyOwner.jsx";
import {GetPropertyReviewsApi} from "../APIs/Properties/GetPropertyReviews.jsx";
import defaultImage from "../assets/balnk_user.png"
import {AddReviewApi} from "../APIs/Reviews/AddReview.jsx";

import dayjs from 'dayjs';

const ShowProperty = ({setState}) => {
  const {id} = useParams();
  const [property, setProperty] = useState(null);
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
      <NavBar user={user} setUser={setUser} setState={setState}/>
      <Property
        property={property}
        user={user}
        cookies={cookies}
      />
    </>
  );
};

function Property({
                    property,
                    user,
                    cookies,
                  }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"MainComponentsContainer"}>
      <div className={"PropertyContainer"}>
        <Title property={property}
               user={user} open={open} setOpen={setOpen} cookies={cookies}/>
        <ImagesContainer property={property}/>
        <ImagesCarousel property={property}/>
        <PropertyInfo property={property} cookies={cookies} user={user}/>
        <RatingComponent property={property}/>
        <ReviewsSection open={open} setOpen={setOpen} property={property} cookies={cookies}/>
      </div>
    </div>
  );
}

function Title({property, user, setOpen, cookies}) {
  const [wishlistedProperties, setWishlistedProperties] = useState([]);
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
    (wishlistedProperty) => `${wishlistedProperty.id}` === `${property.id}`,
  );
  const AddToWishlist = async () => {
    if (!user) {
      return;
    }
    const [data, error] = await AddToWishlistApi(cookies.jwt, property.id);
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
    const [data, error] = await RemoveFromWishlistApi(cookies.jwt, property.id);
    if (data) {
      setWishlistedProperties(
        wishlistedProperties.filter(
          (wishlistedProperty) => `${wishlistedProperty.id}` !== `${property.id}`,
        ),
      );
    }
    if (error) {
      console.log(error);
    }
  };
  const showModal = () => {
    setOpen(true);
  };
  return (
    <div className={"title"}>
      <div className={"PropertyPlace"}>

        {property.type_of_property} in {property.place}
      </div>
      {
        user &&
        < div className={"actions"}>
          <button className={"AddYourReview"} onClick={showModal}>
            Add your review
          </button>
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

        </div>
      }

    </div>
  )
}

function ImagesContainer({property}) {
  return (
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
  )
}

function ImagesCarousel({property}) {
  return (
    <div className={"ImagesCarousel"}>
      <Carousel draggable={true} arrows={true}
                style={{height: "400px"}}>
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
  )
}

function PropertyInfo({cookies, property, user}) {
  return (
    <div className={"propertyInfo"}>
      <LeftColumn property={property}/>
      <RightColumn property={property} cookies={cookies} user={user}/>
    </div>
  )
}

function LeftColumn({property}) {
  const cancellationDate = new Date(property.start_date);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const [propertyOwner, setPropertyOwner] = useState(null);
  cancellationDate.setDate(cancellationDate.getDate() - 10)
  useEffect(() => {
    async function fetchOwner() {
      if (property) {
        const [data, error] = await GetPropertyOwnerApi(property.id);
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
  return (
    <div className={"leftColumn"}>
      <UpperInfo property={property}/>
      <HosterInfo property={property} propertyOwner={propertyOwner}/>
      <ProcessRating property={property} propertyOwner={propertyOwner}/>

      <Description property={property}/>

      <BedRooms property={property}/>
    </div>
  )
}

function UpperInfo({property}) {
  return (
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
        <a href={"#reviews"}> {property.num_of_reviews} reviews</a>
      </div>
    </div>
  )
}

function HosterInfo({propertyOwner}) {

  return (
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
  )
}

function ProcessRating({property, propertyOwner}) {
  const cancellationDate = new Date(property.start_date);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  cancellationDate.setDate(cancellationDate.getDate() - 10)
  return (
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
  )
}

function Description({property}) {
  return (
    <div className={"description"}>
      {property.description}
    </div>
  )
}

function BedRooms({property}) {
  return (
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
  )
}

const {RangePicker} = DatePicker;

function RightColumn({property, user, cookies}) {
  const [startDate, setStartDate] = useState(dayjs(property.start_date));
  const [endDate, setEndDate] = useState(dayjs(property.end_date));
  const navigate = useNavigate();

  const numberOfNights = (start, end) => end.diff(start, 'day');
  const numberOfDays = numberOfNights(startDate, endDate);

  const formatDate = (date) => date.format("YYYY-MM-DD");

  const disabledStartDate = (current) => {
    return (
      current && (current.isBefore(dayjs(property.start_date), 'day') || current.isAfter(dayjs(property.end_date), 'day'))
    );
  };

  const disabledEndDate = (current) => {
    return (
      current && (current.isBefore(startDate, 'day') || current.isAfter(dayjs(property.end_date), 'day'))
    );
  };


  return (
    <div className="rightColumn">
      <div className="priceCard">
        <div className="price">
          <span>$ {property.price}</span> / night
        </div>
        <div className="checkingInfo">
          <table>
            <tbody>
            <tr>
              <td>
                <span className="title">Check In</span>
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  disabledDate={disabledStartDate}
                  format="DD-MM-YYYY"
                />
              </td>
              <td>
                <span className="title">Check Out</span>
                <DatePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  disabledDate={disabledEndDate}
                  format="DD-MM-YYYY"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <span className="title">Guests</span>
                <span className="value">{property.max_guests}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        {user && (
          <button
            className="reserve"
            onClick={() =>
              navigate(
                `/reservation/${property.id}?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&total_price=${property.price * (numberOfDays + 1)}&number_of_days=${numberOfDays + 1}`,
              )
            }

          >
            Reserve
          </button>
        )}
        <div className="totalPriceInfo">
          <span>{property.price} x {numberOfDays + 1} Nights</span>
          <span>$ {property.price * (numberOfDays + 1)}</span>
        </div>
      </div>
    </div>
  );
}


function RatingComponent({property}) {
  return (
    <div className={"RatingComponent"}>
      <Rating property={property}/>
      <FinalRating property={property}/>
      <OverallRating property={property}/>
    </div>
  )
}

function Rating({property}) {
  return (
    <div className={"Rating"}>
      <svg fill="#000000" width="90px" height="90px" viewBox="0 0 32 32" version="1.1"
           xmlns="http://www.w3.org/2000/svg">
        <title>feather-wing</title>
        <path
          d="M28.665 25.537c-1.966-1.094-3.116-2.962-3.232-4.673-0.619-9.164-15.889-10.357-23.662-19.509l-0 0c0.403 11.661 13.204 11.604 20.744 17.449-4.879-2.113-12.876-1.649-18.664-5.404 2.7 8.775 12.332 5.886 19.406 8.271-4.212-0.411-9.768 1.968-15.020 0.086 4.638 7.31 10.654 2.427 16.483 2.47-2.94 0.749-5.977 4.025-10.036 3.718 4.946 4.76 7.536 0.139 11.079-1.633-0.357 0.425-0.583 0.967-0.61 1.565-0.064 1.443 1.054 2.665 2.497 2.73s2.665-1.054 2.73-2.497c0.052-1.169-0.672-2.193-1.716-2.574z"></path>
      </svg>
      <span>{property.property_rate}</span>

      <svg fill="#000000" width="90px" height="90px" viewBox="0 0 32 32" version="1.1"
           xmlns="http://www.w3.org/2000/svg">
        <title>feather-wing</title>
        <path
          d="M28.665 25.537c-1.966-1.094-3.116-2.962-3.232-4.673-0.619-9.164-15.889-10.357-23.662-19.509l-0 0c0.403 11.661 13.204 11.604 20.744 17.449-4.879-2.113-12.876-1.649-18.664-5.404 2.7 8.775 12.332 5.886 19.406 8.271-4.212-0.411-9.768 1.968-15.020 0.086 4.638 7.31 10.654 2.427 16.483 2.47-2.94 0.749-5.977 4.025-10.036 3.718 4.946 4.76 7.536 0.139 11.079-1.633-0.357 0.425-0.583 0.967-0.61 1.565-0.064 1.443 1.054 2.665 2.497 2.73s2.665-1.054 2.73-2.497c0.052-1.169-0.672-2.193-1.716-2.574z"
          transform="scale(-1, 1) translate(-32, 0)"
        ></path>
      </svg>
      <div className={"text"}>
        <div className={"tit"}>
          Guest favorite
        </div>
        <div className={"description"}>
          This home is a guest favorite based on ratings, reviews, and reliability
        </div>
      </div>
    </div>
  )
}

function FinalRating({property}) {
  return (
    <div className={"FinalRating"}>
      <div>
        <StarFilled/> {property.property_rate} . {property.num_of_reviews} reviews
      </div>
    </div>
  )
}

function OverallRating({property}) {
  return (
    <div className={"OverallRating"}>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Cleanliness</p>
          <p>
            <StarFilled/>
            {property.ave_cleanliness}</p>
        </div>
        <div className={"RateIcon"}>
          <svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink"
               width="60px" height="60px" viewBox="0 0 32 32" xml:space="preserve">
<style type="text/css">
</style>
            <path className="linesandangles_een" d="M21,10V8.236l1-2V3H10v3.721l2.735,0.912l-0.684,2.051l1.897,0.633l0.684-2.052L15,8.387V10
	c0,0-1,5-2,6c-1,1-3,3-3,7c0,2,0,6,0,6h13c0,0,0-4,0-8C23,17,21,10,21,10z M12,5h8v0.764L19.382,7h-2.221L12,5.279V5z M17,9h2v1h-2
	V9z M21,27h-9v-4c0-3.171,1.511-4.683,2.414-5.586c0.943-0.943,1.679-3.231,2.197-5.414h2.854C20.026,14.192,21,18.37,21,21V27z"/>
</svg>
        </div>
      </div>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Accuracy</p>
          <p>
            <StarFilled/>
            {property.ave_accurancy}</p>
        </div>
        <div className={"RateIcon"}>
          <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="white"/>
            <path d="M7 13.4545L8.97619 15.3409C9.36262 15.7098 9.97072 15.7098 10.3571 15.3409L17 9"
                  stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Check-in</p>
          <p>
            <StarFilled/>
            {property.ave_check_in}</p>
        </div>
        <div className={"RateIcon"}>
          <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.0635 12.5C21.6591 11.4704 22 10.275 22 9C22 5.13401 18.866 2 15 2C11.134 2 8 5.13401 8 9C8 12.866 11.134 16 15 16C16.0736 16 17.0907 15.7583 18 15.3264"
              stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="15" cy="9" r="2" stroke="#1C274C" stroke-width="1.5"/>
            <path d="M3.5 20.5L9.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M6 21L4.5 19.5M6.5 17.5L8 19" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Communication</p>
          <p>
            <StarFilled/>
            {property.ave_communication}</p>
        </div>
        <div className={"RateIcon"}>
          <svg width="60px" height="60px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">

            <title>comment-1</title>
            <desc>Created with Sketch Beta.</desc>
            <defs>

            </defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
              <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-100.000000, -255.000000)"
                 fill="#000000">
                <path
                  d="M116,281 C114.832,281 113.704,280.864 112.62,280.633 L107.912,283.463 L107.975,278.824 C104.366,276.654 102,273.066 102,269 C102,262.373 108.268,257 116,257 C123.732,257 130,262.373 130,269 C130,275.628 123.732,281 116,281 L116,281 Z M116,255 C107.164,255 100,261.269 100,269 C100,273.419 102.345,277.354 106,279.919 L106,287 L113.009,282.747 C113.979,282.907 114.977,283 116,283 C124.836,283 132,276.732 132,269 C132,261.269 124.836,255 116,255 L116,255 Z"
                  id="comment-1" sketch:type="MSShapeGroup">

                </path>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Location</p>
          <p>
            <StarFilled/>
            {property.ave_location}</p>
        </div>
        <div className={"RateIcon"}>
          <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="#000000"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div className={"RateContainer"}>
        <div className={"title"}>
          <p>Value</p>
          <p>
            <StarFilled/>
            {property.ave_value}</p>
        </div>
        <div className={"RateIcon"}>
          <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink"
               width="60px" height="60px" viewBox="0 0 72 72" enable-background="new 0 0 72 72"
               xml:space="preserve">
<g>
	<path d="M66.318,7.585c-0.045-0.905-0.705-1.675-1.601-1.856c-0.077-0.015-0.153-0.026-0.229-0.033L38.635,3.139
		c-0.601-0.06-1.187,0.152-1.611,0.576L6.55,34.191c-4.571,4.571-4.571,7.359,0,11.929l19.338,19.34
		c2.049,2.05,3.847,3.412,5.965,3.412s3.916-1.366,5.961-3.413l30.479-30.478c0.424-0.423,0.635-1.014,0.576-1.611L66.318,7.585z
		 M34.987,62.631c-0.961,0.961-2.332,2.24-3.134,2.24c-0.803,0-2.175-1.279-3.137-2.24L9.378,43.291
		c-2.989-2.988-2.989-3.283,0-6.271L39.186,7.212l23.303,2.306l2.308,23.304L34.987,62.631z"/>
  <path d="M24.043,27.496l-9.09,9.089c-2.295,2.295-2.925,3.851-0.297,6.479c0.195,0.195,0.451,0.293,0.707,0.293
		c0.256,0,0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.022,0-1.414c-1.567-1.567-1.548-1.805,0.297-3.651l9.09-9.089
		c0.391-0.391,0.391-1.023,0-1.414S24.434,27.105,24.043,27.496z"/>
  <path d="M26.888,24.649l-0.813,0.814c-0.39,0.391-0.39,1.024,0.002,1.414c0.195,0.194,0.45,0.292,0.706,0.292
		c0.256,0,0.512-0.097,0.708-0.294l0.813-0.814c0.39-0.391,0.39-1.024-0.002-1.414C27.911,24.258,27.279,24.256,26.888,24.649z"/>
  <path d="M50.604,12.862c-4.571,0-8.293,3.72-8.293,8.292c0,4.572,3.722,8.292,8.293,8.292c4.573,0,8.291-3.72,8.291-8.292
		C58.895,16.582,55.176,12.862,50.604,12.862z M50.604,25.446c-2.367,0-4.293-1.926-4.293-4.292c0-2.366,1.926-4.292,4.293-4.292
		c2.369,0,4.291,1.926,4.291,4.292C54.895,23.52,52.971,25.446,50.604,25.446z"/>
</g>
</svg>
        </div>
      </div>
    </div>
  )
}

function ReviewsSection({open, setOpen, property, cookies}) {

  const [propertyReviews, setPropertyReviews] = useState([]);
  useEffect(() => {
    async function fetchPropertyReviews() {
      const [data, error] = await GetPropertyReviewsApi(property.id);
      if (data) {
        setPropertyReviews(data);
      }
      if (error) {
        console.log(error);
      }
    }

    fetchPropertyReviews();
  }, [property.id])


  const [visibleCount, setVisibleCount] = useState(6);

  const handleReadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };


  return (
    <div className="ReviewsSection" id="reviews">
      <ReviewModal cookies={cookies} open={open} setOpen={setOpen} property={property}/>

      <Reviews propertyReviews={propertyReviews} visibleCount={visibleCount}/>

      {visibleCount < propertyReviews.length && (
        <button onClick={handleReadMore} className={"ReadMoreBtn"}>Read More</button>
      )}
    </div>
  )
}

function ReviewModal({cookies, open, setOpen, property}) {
  const handleCancel = () => {
    setOpen(false);
  };
  const [ckechInRate, setCheckInRate] = useState(0);
  const [communicationRate, setCommunicationRate] = useState(0);
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [cleanlinessRate, setCleanlinessRate] = useState(0);
  const [review, setReview] = useState("");
  const [locationRate, setLocationRate] = useState(0);
  const [valueRate, setValueRate] = useState(0);

  const handleOk = async () => {
    if (
      !ckechInRate ||
      !cleanlinessRate ||
      !accuracyRate ||
      !communicationRate ||
      !locationRate ||
      !valueRate ||
      !review
    ) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      await AddReviewApi(cookies.jwt, {
        check_in_rating: ckechInRate,
        communication_rating: communicationRate,
        accurancy_rating: accuracyRate,
        cleanliness_rating: cleanlinessRate,
        content: review,
        location_rating: locationRate,
        value_rating: valueRate,
        property_id: property.id
      });

      message.success("Review added successfully");
      setOpen(false);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      message.error("Failed to add review. Please try again later.");
      console.error("Error adding review:", error);
    }
  };

  return (
    <Modal
      open={open}
      title="Add your review"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" type="primary" onClick={handleOk}>
          Add Review
        </Button>,
      ]}
    >
      <div className={"RatingElementsContainer"}>
        <div className={"Rate"}>
          Check In
          <Rate
            allowHalf={true}
            value={ckechInRate}
            onChange={(value) => setCheckInRate(value)}
          />
          {ckechInRate}
        </div>
        <div className={"Rate"}>
          Cleanliness
          <Rate
            allowHalf={true}
            value={cleanlinessRate}
            onChange={(value) => setCleanlinessRate(value)}
          />
          {cleanlinessRate}
        </div>
        <div className={"Rate"}>
          Accuracy
          <Rate
            allowHalf={true}
            value={accuracyRate}
            onChange={(value) => setAccuracyRate(value)}
          />
          {accuracyRate}
        </div>
        <div className={"Rate"}>
          Communication
          <Rate
            allowHalf={true}
            value={communicationRate}
            onChange={(value) => setCommunicationRate(value)}
          />
          {communicationRate}
        </div>
        <div className={"Rate"}>
          Location
          <Rate
            allowHalf={true}
            value={locationRate}
            onChange={(value) => setLocationRate(value)}
          />
          {locationRate}
        </div>
        <div className={"Rate"}>
          Value
          <Rate
            allowHalf={true}
            value={valueRate}
            onChange={(value) => setValueRate(value)}
          />
          {valueRate}
        </div>
        <textarea
          placeholder={"Write your review here"}
          style={{
            padding: 20,
            width: "100%",
            height: 70,
            maxHeight: 300,
            maxWidth: "100%",
            minWidth: "100%",
            minHeight: 70,
            borderRadius: 5,
          }}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>
    </Modal>
  )
}

function Reviews({propertyReviews, visibleCount}) {
  const toggleExpand = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const [expandedReviews, setExpandedReviews] = useState({});

  return (
    <div className="reviews">
      {propertyReviews.slice(0, visibleCount).map((review, index) => {
        const isExpanded = expandedReviews[index];
        const profileImage = review.review_writer.profile_image_url ?? defaultImage;
        return (
          <div className="review" key={index}>
            <div className="NameAndImage">
              <Avatar
                src={profileImage}
                size={50}
              />
              <div className="name">
                {review.review_writer.full_name}
              </div>
            </div>
            <div className="rate">
              <Rate disabled={true} value={review.final_rating} allowHalf={true}/>
            </div>
            <div className="content">
              {isExpanded ? review.content : review.content.slice(0, 100)}

              {review.content.length > 100 && (
                <button onClick={() => toggleExpand(index)}>
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default ShowProperty;
