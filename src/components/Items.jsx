import "../css/items.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GetProperties } from "../APIs/Properties/GetProperties.jsx";
import { Card, Carousel, Col, Image, message, Row } from "antd";
import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import { format } from "date-fns";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function Items({ user }) {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [cookies] = useCookies([]);

  // Fetch properties on component mount
  useEffect(() => {
    async function fetchProperties() {
      try {
        const [data, error] = await GetProperties();
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

  // Add a property to favorites
  const addFavorite = async (id) => {
    if (!cookies.jwt) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/wishlists",
        { property_id: id },
        { headers: { Authorization: cookies.jwt } },
      );
      if (response.status === 200) {
        console.log("Favorite added successfully");
      }
    } catch (err) {
      console.error("An error occurred while adding favorite:", err);
      throw err;
    }
  };

  // Remove a property from favorites
  const removeFavorite = async (id) => {
    if (!cookies.jwt) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3000/api/v1/wishlists/${id}`,
        {
          headers: {
            Authorization: cookies.jwt,
          },
          data: { property_id: id }, // Send property_id in the request body
        },
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      console.error("An error occurred while removing favorite:", err);
      throw err; // Re-throw the error to handle it in toggleFavorite
    }
  };

  // Fetch user's favorites when the user changes
  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchFavorites() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3000/api/v1/wishlists",
          {
            headers: {
              Authorization: cookies.jwt,
            },
          },
        );
        if (response.status === 200) {
          const favorites = response.data.reduce((acc, curr) => {
            acc[curr.property_id] = true;
            return acc;
          }, {});
          setFavorites(favorites);
        }
      } catch (err) {
        console.error("An error occurred while fetching favorites:", err);
      }
    }

    fetchFavorites();
  }, [user, cookies.jwt]);

  // Toggle favorite state
  const toggleFavorite = async (id) => {
    const isFavorite = favorites[id];

    // Optimistically update the UI
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the favorite state
    }));

    try {
      if (!isFavorite) {
        await addFavorite(id); // Add to favorites if not already a favorite
      } else {
        await removeFavorite(id); // Remove from favorites if already a favorite
      }
    } catch (err) {
      console.error("An error occurred while toggling favorite:", err);
      // Revert the state if the API call fails
      setFavorites((prev) => ({
        ...prev,
        [id]: isFavorite, // Revert to the previous state
      }));
    }
  };

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const formattedStartDate = format(new Date(startDate), "ddMMM");
    const formattedEndDate = format(new Date(endDate), "ddMMM");
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  // Show loading state if properties are not yet loaded
  if (!properties.length) {
    return <div>Loading...</div>;
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
                          alt={`${card.country}-${card.owner}-${imgIndex}`}
                          preview={false}
                          className={"propertyImage"}
                        />
                        {user && (
                          <div className="heart-container">
                            {favorites[card.id] ? ( // Use card.id instead of index
                              <HeartFilled
                                className={"heart added"}
                                onClick={() => {
                                  toggleFavorite(card.id);

                                  message.info("Removed from favorites");
                                }}
                              />
                            ) : (
                              <HeartOutlined
                                className={"heart"}
                                onClick={() => {
                                  toggleFavorite(card.id);
                                  message.success("Added from favorites");
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </Carousel>
                }
              >
                <div className={"propertyDetails"}>
                  <div className={"info"}>
                    <div className={"location"}>
                      {card.city} - {card.country}
                    </div>
                    <div className={"rate"}>
                      <StarFilled style={{ color: "gold" }} />
                      {card.property_rate}
                    </div>
                  </div>
                  <div className={"owner"}>
                    Stay With{" "}
                    <span style={{ cursor: "pointer" }}>{card.owner}</span>
                  </div>
                  <div className={"duration"}>
                    {formatDateRange(card.start_date, card.end_date)}
                  </div>
                  <div className={"price"}>
                    <span>$ {card.price}</span> / night
                  </div>
                </div>
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
