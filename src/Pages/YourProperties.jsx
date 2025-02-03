import {useNavigate, useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Image, message, Modal} from "antd";
import {StarFilled} from "@ant-design/icons";
import {RemovePropertyApi} from "../APIs/Properties/RemoveProperty.jsx";

export default function YourProperties() {
  const {UserProfile} = useOutletContext();
  const [PropertyList, setPropertyList] = useState([]);
  const [cookies, removeCookie] = useCookies(["jwt"]);

  useEffect(() => {
    if (UserProfile) setPropertyList(UserProfile.user_properties);
  }, [UserProfile]);

  useEffect(() => {
    if (cookies.jwt) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile/properties; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);

  const navigate = useNavigate();
  console.log(PropertyList);
  const HandelRemoveProperty = (id) => {
    Modal.confirm({
      title: 'Do you want to delete this property?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        const [response, error] = await RemovePropertyApi(id, cookies.jwt);
        if (response) {
          message.success("Property removed successfully");
        } else {
          message.error(error.message || "Failed to remove property");
        }
        window.location.reload();
      },
      onCancel: () => {
        window.location.reload();
      }
    })
  };

  if (PropertyList.length === 0) {
    return (
      <div style={{
        width: "80%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px"
      }}>
        <svg width="300px" height="300px" viewBox="0 0 1024 1024" className="icon" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M512 64c-247.42 0-448 200.58-448 448s200.58 448 448 448 448-200.58 448-448-200.58-448-448-448z m0 832c-207.31 0-384-133.19-448-320 64-186.81 240.69-320 448-320s384 133.19 448 320c-64 186.81-240.69 320-448 320z m0-576c-70.69 0-128 57.31-128 128s57.31 128 128 128 128-57.31 128-128-57.31-128-128-128z m0 224c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64z"
            fill="#8a8a8a"></path>
        </svg>
        <h1 style={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          fontSize: "22px",
          color: "#8a8a8a"
        }}>You have no properties listed</h1>
        <p style={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          fontSize: "16px",
          color: "#8a8a8a"
        }}>List your properties to start receiving reservations</p>
      </div>
    );
  }

  return (
    <div style={{width: "90%", margin: "0 auto", minHeight: "100vh", padding: "20px"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
        <h1 style={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          fontSize: "28px"
        }}>
          Your Properties
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        justifyContent: "center"
      }}>
        {PropertyList.map((property) => (
          <div key={property.property.id} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            textAlign: "center",
            transition: "transform 0.3s ease-in-out",
            cursor: "pointer"
          }}
               onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
               onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <Image src={property.property.images[0]} width={150} height={150}
                   style={{borderRadius: "10px", objectFit: "cover", marginBottom: 10}}
                   preview={false}/>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                margin: "20px 0,",
                fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
              }}>{property.property.city}, {property.property.country}</h2>
            <span style={{display: "flex", alignItems: "center", gap: "5px", fontSize: "18px", fontWeight: "bold"}}>
              {property.property.property_rate} <StarFilled style={{color: "gold"}}/>
            </span>
            <div style={{fontSize: "16px", color: "#555", marginTop: "10px"}}>
              <p><span
                style={{fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",}}>Number of Reviews:</span> {property.reservations.num_of_reviews}
              </p>
              <p><span
                style={{fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",}}>Type:</span> {property.property.type_of_property}
              </p>
              <p><span
                style={{fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",}}>Price per Night:</span> ${property.property.price}
              </p>
            </div>
            <div style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px"}}>
              <button style={{
                padding: "8px 15px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s"
              }}
                      onClick={() => {
                        sessionStorage.setItem('state', 'edit');
                        sessionStorage.setItem('property', JSON.stringify(property));
                        navigate(`/property/create_new?id=${property.property.id}`);
                      }}
              >Edit
              </button>
              <button style={{
                padding: "8px 15px",
                border: "none",
                backgroundColor: "#28a745",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s"
              }}
                      onClick={() => {
                        sessionStorage.setItem('property', JSON.stringify(property));
                        t
                        navigate(`/profile/property/${UserProfile?.id}`);

                      }}
              >View
              </button>
              <button style={{
                padding: "8px 15px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s"
              }}
                      onClick={() => {
                        HandelRemoveProperty(property.property.id)
                      }}
              >Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
