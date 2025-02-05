import "../css/items.css";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {GetProperties} from "../APIs/Properties/GetProperties.jsx";
import {Card, Carousel, Col, Image, message, Row, Spin} from "antd";
import {HeartFilled, HeartOutlined, StarFilled} from "@ant-design/icons";
import {format} from "date-fns";
import {useCookies} from "react-cookie";
import {AddToWishlistApi} from "../APIs/Wishlist/AddToWishlist.jsx";
import {RemoveFromWishlistApi} from "../APIs/Wishlist/RemoveFromWishlist.jsx";
import {GetAllFavourites} from "../APIs/Wishlist/GetAllFavourites.jsx";
import {Link} from "react-router-dom";

export default function Items({user}) {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [cookies] = useCookies([]);

  // Fetch properties on component mount
  useEffect(() => {
    async function fetchProperties() {
      try {
        const [data, error] = await GetProperties(cookies.jwt);
        if (data) {
          setProperties(data);
        } else {
          console.error("Error fetching properties:", error);
        }
      } catch (err) {
        console.error("An error occurred while fetching properties:", err);
      }
    }

    fetchProperties();
  }, []);

  const AddToFavourites = async (id) => {
    if (!cookies.jwt) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await AddToWishlistApi(cookies.jwt, id);
      if (response) {
        return true;
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      message.error("Error adding to wishlist");
    }
  };

  const RemoveFromFavourites = async (id) => {
    if (!cookies.jwt) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await RemoveFromWishlistApi(cookies.jwt, id);
      if (response) {
        return true;
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      message.error("Error removing from wishlist");
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchFavorites() {
      const [data, error] = await GetAllFavourites(cookies.jwt);
      if (data) {
        const favorites = data.reduce((acc, curr) => {
          acc[curr.property_id] = true;
          return acc;
        }, {});
        setFavorites(favorites);
      } else {
        console.error("Error fetching favorites:", error);
      }
    }

    fetchFavorites();
  }, [user, cookies.jwt]);

  const toggleFavorite = async (id) => {
    const isFavorite = favorites[id];

    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    try {
      if (!isFavorite) {
        await AddToFavourites(id);
      } else {
        await RemoveFromFavourites(id);
      }
    } catch (err) {
      console.error("An error occurred while toggling favorite:", err);
      setFavorites((prev) => ({
        ...prev,
        [id]: isFavorite,
      }));
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const formattedStartDate = format(new Date(startDate), "ddMMM");
    const formattedEndDate = format(new Date(endDate), "ddMMM");
    return `${formattedStartDate} - ${formattedEndDate}`;
  };
  if (!properties.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 110px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loader">
          <Spin size="large" spinning={true}/>
        </div>
      </div>
    );
  }

  return (
    <div className={"itemsContainer"}>
      <div className={"items"}>
        <Row gutter={[16, 16]}>
          {properties.map((card) => (
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
                        {user && (
                          <div className="heart-container">
                            {favorites[card.id] ? (
                              <HeartFilled
                                className={"heart added"}
                                onClick={() => toggleFavorite(card.id)}
                              />
                            ) : (
                              <HeartOutlined
                                className={"heart"}
                                onClick={() => toggleFavorite(card.id)}
                              />
                            )}
                          </div>
                        )}
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

Items.propTypes = {
  user: PropTypes.object,
};
