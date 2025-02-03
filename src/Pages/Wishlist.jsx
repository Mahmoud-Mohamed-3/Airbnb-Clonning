import {Link, useOutletContext, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Card, Carousel, Col, Empty, Image, message, Row} from "antd";
import {HeartFilled, StarFilled} from "@ant-design/icons";
import {format} from "date-fns";
import {RemoveFromWishlistApi} from "../APIs/Wishlist/RemoveFromWishlist.jsx";

export default function Wishlist() {
  const {UserProfile, setUserProfile} = useOutletContext();
  const {id} = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [userWishlistedProperties, setUserWishlistedProperties] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);


  useEffect(() => {
    if (cookies.jwt) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile/wishlist; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);

  useEffect(() => {
    if (UserProfile) {
      setUserWishlistedProperties(UserProfile.user_whishlisted_properties || []);
    }
  }, [UserProfile]);

  useEffect(() => {
    if (!cookies.jwt) {
      setUnauthorized(true);
    }
  }, [cookies]);

  const formatDateRange = (startDate, endDate) => {
    const formattedStartDate = format(new Date(startDate), "ddMMM");
    const formattedEndDate = format(new Date(endDate), "ddMMM");
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  const RemoveFromFavourites = async (id) => {
    if (!cookies.jwt) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await RemoveFromWishlistApi(cookies.jwt, id);
      if (response) {
        window.location.reload();
        return true;
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      message.error("Error removing from wishlist");
    }
  };
  if (userWishlistedProperties.length === 0) {
    return (
      <div
        style={{
          width: "80%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Empty
          image={
            <svg
              width="300px"
              height="300px"
              viewBox="0 0 1024 1024"
              className="icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M503.53152 344.4224m-262.5024 0a262.5024 262.5024 0 1 0 525.0048 0 262.5024 262.5024 0 1 0-525.0048 0Z"
                fill="#F2FAFE"
              />
              <path
                d="M279.42912 725.46304v-0.04096l-3.47136 0.04096C164.33152 725.46304 73.6256 636.68224 71.71072 526.4384L71.68 522.9056C71.68 411.0336 163.14368 320.33792 275.968 320.33792c102.912 0 188.04736 75.4688 202.20928 173.62944h4.47488v-1.36192c0-127.32416 103.04512-230.77888 230.94272-232.83712l3.8912-0.03072C847.17568 259.7376 952.32 364.00128 952.32 492.5952c0 128.6144-105.14432 232.86784-234.83392 232.86784l2.60096-0.03072v0.03072H279.43936z"
                fill="#DFF1FB"
              />
            </svg>
          }
          description={
            <h1
              style={{
                fontFamily:
                  "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
              }}
            >
              No Favourite Properties
            </h1>
          }
        />
      </div>
    );
  }

  console.log(userWishlistedProperties)
  return (
    <div className={"itemsContainer"}>
      <div
        style={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          fontSize: 25,
          marginBottom: 20,
          textAlign: "center"
        }}>
        Your Favourite Properties
      </div>
      <div className={"items"}>
        <Row gutter={[16, 16]}>
          {userWishlistedProperties?.map((card) => (
            <Col key={card.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card
                className={"property"}
                bordered={false}
                cover={
                  <Carousel draggable={true} arrows={true}>
                    {card.images.map((image, imgIndex) => (
                      <div className={"cont"} key={imgIndex}>
                        <Image
                          src={image}
                          alt={`${card.country}-${card.owner.first_name}-${imgIndex}`}
                          preview={false}
                          className={"propertyImage"}
                        />

                        <div className="heart-container">

                          <HeartFilled
                            className={"heart added"}
                            onClick={() => {
                              RemoveFromFavourites(card.id)
                            }}
                          />
                        </div>

                      </div>
                    ))}
                  </Carousel>
                }
              >
                <Link
                  to={`/property/${card.city}/${card.id}/${card.owner.first_name}/${card.user_id}`}
                >
                  <div className={"propertyDetails"}>
                    <div className={"info"}>
                      <div className={"location"}>
                        {card.city} - {card.country}
                      </div>
                      <div className={"rate"}>
                        <StarFilled style={{color: "gold"}}/>
                        {card.property_rate}
                      </div>
                    </div>
                    <div className={"owner"}>
                      Stay With{" "}
                      <span style={{cursor: "pointer"}}>{card.owner.first_name}</span>
                    </div>
                    <div className={"duration"}>
                      {formatDateRange(card.start_date, card.end_date)}
                    </div>
                    <div className={"price"}>
                      <span>$ {card.price}</span> / night
                    </div>
                  </div>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
