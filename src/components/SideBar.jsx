import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Link, useLocation, useParams} from "react-router-dom";
import {Avatar, message, Spin} from "antd";
import "../css/SideBar.css";
import "../css/Side_bar.css";
import {LogoutApi} from "../APIs/User/Logout.jsx";

export default function SideBar({UserProfile, setUserProfile}) {
  const [cookies, removeCookie] = useCookies([]);
  const {id} = useParams();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    sessionStorage.getItem("activeLink") || "Profile"
  );

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("wishlist")) {
      setActiveLink("Wishlist");
    } else if (path.includes("received_reservations")) {
      setActiveLink("Reservations");
    } else if (path.includes("requests")) {
      setActiveLink("Requests");
    } else if (path.includes("properties")) {
      setActiveLink("Properties");
    } else if (path.includes("profile")) {
      setActiveLink("Profile");
    }
  }, [location.pathname]);

  useEffect(() => {
    sessionStorage.setItem("activeLink", activeLink);
  }, [activeLink]);

  async function handelLogout() {
    await LogoutApi(cookies.jwt);
    removeCookie("jwt", {path: "/", domain: "localhost"});

    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";

    setTimeout(() => {
      console.log("JWT after logout:", cookies.jwt);
      window.location.href = "/login";
    }, 500);

    message.success("Logout successful!");
  }

  if (!UserProfile) {
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
    <div className={"SideBarContainer"}>
      <div className={"userImage"}>
        <Avatar
          shape={"circle"}
          src={UserProfile?.profile_image_url}
          alt={"User Profile"}
          size={60}
        />
        <div className={"UserName"}>{UserProfile?.first_name}</div>
      </div>
      <div className={"LinksContainer"}>
        <div className={"Links"}>
          <div
            className={activeLink === "Profile" ? "Link active" : "Link"}
            onClick={() => setActiveLink("Profile")}
          >
            <Link to={`/profile/${UserProfile.id}`}>Profile</Link>
          </div>
          <div
            className={activeLink === "Wishlist" ? "Link active" : "Link"}
            onClick={() => setActiveLink("Wishlist")}
          >
            <Link to={`/profile/wishlist/${UserProfile.id}`}>Favourites</Link>
          </div>
          <div
            className={activeLink === "Reservations" ? "Link active" : "Link"}
            onClick={() => setActiveLink("Reservations")}
          >
            <Link to={`/profile/received_reservations/${UserProfile.id}`}>
              Reservations
            </Link>
          </div>
          <div
            className={activeLink === "Requests" ? "Link active" : "Link"}
            onClick={() => setActiveLink("Requests")}
          >
            <Link to={`/profile/requests/${UserProfile.id}`}>Requests</Link>
          </div>

          <div
            className={activeLink === "Properties" ? "Link active" : "Link"}
            onClick={() => setActiveLink("Properties")}
          >
            <Link to={`/profile/properties/${UserProfile.id}`}>
              Properties
            </Link>
          </div>
        </div>
        <div className={"Assets"}>
          <div className={"BackToHome"}>
            <Link to={"/"}>Back to Home</Link>
          </div>
          <button className={"LogoutButton"} onClick={handelLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}