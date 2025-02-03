import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Carousel} from "antd";
import "antd/dist/reset.css";
import defaultImage from "../assets/balnk_user.png"

export default function ShowPropertyForOwner() {
  const [property, setProperty] = useState(null);
  const [cookies, removeCookie] = useCookies(["jwt"]);
  const [activeTab, setActiveTab] = useState("overview"); // Default tab
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (cookies.jwt) {
      document.cookie =
        "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile/property; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);

  useEffect(() => {
    const storedProperty = sessionStorage.getItem("property");
    if (storedProperty) {
      setProperty(JSON.parse(storedProperty));
    }
  }, []);

  if (!property) {
    return <div style={{textAlign: "center", fontSize: "1.5rem", marginTop: "50px"}}>Loading...</div>;
  }
  console.log(property)
  const tabData = Array.isArray(property[activeTab]) ? property[activeTab] : [];

  const paginatedItems = tabData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(tabData.length / itemsPerPage);

  return (
    <div style={{padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto"}}>
      {/* Tabs */}
      <div style={{display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px"}}>
        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: activeTab === "overview" ? "#ff5a5f" : "#ddd",
            color: activeTab === "overview" ? "#fff" : "#000",
            cursor: "pointer",
            fontWeight: "bold",
            width: "150px",
          }}
          onClick={() => setActiveTab("overview")}
        >
          Property Overview
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: activeTab === "reviews" ? "#ff5a5f" : "#ddd",
            color: activeTab === "reviews" ? "#fff" : "#000",
            cursor: "pointer",
            fontWeight: "bold",
            width: "150px",
          }}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: activeTab === "reservations" ? "#ff5a5f" : "#ddd",
            color: activeTab === "reservations" ? "#fff" : "#000",
            cursor: "pointer",
            fontWeight: "bold",
            width: "150px",
          }}
          onClick={() => setActiveTab("reservations")}
        >
          Reservations
        </button>
      </div>

      {activeTab === "overview" && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#ddd",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "1200px",
            margin: "0 auto",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "20px",
              fontWeight: "600",
              color: "#333",
              textAlign: "center",
            }}
          >
            Property Overview
          </h2>

          <Carousel autoplay style={{marginBottom: "30px"}} arrows={true} draggable={true}>
            {property.property.images.map((photo, index) => (
              <div key={index} style={{margin: "0 auto"}}>
                <img
                  src={photo}
                  alt={`Property ${index + 1}`}
                  style={{
                    width: "300px",
                    height: 300,
                    borderRadius: "8px",
                    objectFit: "cover",
                    margin: "0 auto",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            ))}
          </Carousel>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              padding: "0 20px",
            }}
          >
            {[
              {
                label: "Property ID",
                value: property.property.id,
              },
              {
                label: "City",
                value: property.property.city,
              },
              {
                label: "Country",
                value: property.property.country,
              },
              {
                label: "Price",
                value: `$${property.property.price}`,
              },
              {
                label: "Start Date",
                value: new Date(property.property.start_date).toLocaleDateString(),
              },
              {
                label: "End Date",
                value: new Date(property.property.end_date).toLocaleDateString(),
              },
              {
                label: "Type",
                value: property.property.type_of_property,
              },
              {
                label: "Location",
                value: property.property.place,
              },
              {
                label: "Max Guests",
                value: property.property.max_guests,
              },
              {
                label: "Beds",
                value: property.property.beds,
              },
              {
                label: "Bedrooms",
                value: property.property.bedrooms,
              },
              {
                label: "Baths",
                value: property.property.baths,
              },
              {
                label: "Reviews",
                value: property.property.num_of_reviews,
              },
              {
                label: "Property Rating",
                value: property.property.property_rate,
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f8f8f8",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease-in-out",
                  cursor: "pointer",
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <p>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div style={{width: "80%", margin: "0 auto"}}>
          <h2 style={{fontSize: "1.8rem", marginBottom: "20px", textAlign: "center"}}>
            Reviews
          </h2>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  maxWidth: "500px",
                  margin: "10px auto",
                }}
              >

                <div style={{display: "flex", alignItems: "center", marginBottom: "15px"}}>
                  <img
                    src={item.review_writer?.profile_image_url}
                    alt={item.review_writer?.full_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{fontWeight: "bold", margin: 0}}>
                      {item.review_writer?.full_name.split(" ")[0]} {/* First Name */}
                    </p>
                    <p style={{margin: 0, color: "#777", fontSize: "0.9rem"}}>
                      Review Writer
                    </p>
                  </div>
                </div>


                <p style={{fontSize: "1rem", marginBottom: "15px"}}>{item.content}</p>


                <div style={{display: "flex", alignItems: "center"}}>
            <span style={{fontWeight: "bold", fontSize: "1.2rem", marginRight: "10px"}}>
              Overall Rating:
            </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: item.final_rating >= 4 ? "#4CAF50" : item.final_rating >= 3 ? "#FF9800" : "#F44336",
                    }}
                  >
              {item.final_rating.toFixed(1)} <span style={{fontSize: "1rem"}}>/ 5</span>
            </span>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      )}

      {activeTab === "reservations" && (
        <div style={{width: "80%", margin: "0 auto"}}>
          <h2 style={{fontSize: "1.8rem", marginBottom: "20px", textAlign: "center"}}>
            Reservations
          </h2>

          {property.reservations && property.reservations.users && property.reservations.users.length > 0 ? (
            property.reservations.users.map((reservation, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  maxWidth: "500px",
                  margin: "10px auto",
                }}
              >
                <div style={{display: "flex", alignItems: "center", marginBottom: "15px"}}>
                  <img
                    src={reservation.user_profile_image || defaultImage}
                    alt={reservation.user_first_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{fontWeight: "bold", margin: 0}}>
                      {reservation.user_first_name} {reservation.user_last_name}
                    </p>
                    <p style={{margin: 0, color: "#777", fontSize: "0.9rem"}}>
                      Reservation User
                    </p>
                  </div>
                </div>

                <div style={{display: "flex", alignItems: "center"}}>
            <span style={{fontWeight: "bold", fontSize: "1.2rem", marginRight: "10px"}}>
              Status:
            </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: reservation.status === "approved"
                        ? "#4CAF50"
                        : reservation.status === "pending"
                          ? "#FF9800"
                          : "#F44336",
                    }}
                  >
              {reservation.status}
            </span>
                </div>
              </div>
            ))
          ) : (
            <p>No reservations available.</p>
          )}
        </div>
      )}


      {totalPages > 1 && (
        <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              style={{
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: currentPage === i + 1 ? "#ff5a5f" : "#ddd",
                color: currentPage === i + 1 ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
