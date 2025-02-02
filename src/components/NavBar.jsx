import defaultImg from "../assets/balnk_user.png";
import "../css/navBar.css";
import {Avatar, Button, Dropdown, Input, message} from "antd";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogoutApi} from "../APIs/User/Logout.jsx";

// eslint-disable-next-line react/prop-types
export default function NavBar({user, setUser}) {
  const [items, setItems] = useState([]);
  const [cookies, setCookies, removeCookie] = useCookies([]);

  async function handelLogout() {
    await LogoutApi(cookies.jwt); // Call API (assuming it logs out successfully)

    removeCookie("jwt", {path: "/", domain: "localhost"});
    setUser(null);
    // Force expire cookie if necessary
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";

    setTimeout(() => {
      console.log("JWT after logout:", cookies.jwt); // Debugging
      window.location.href = "/login"; // Redirect after ensuring removal
    }, 500);

    message.success("Logout successful!");
  }

  useEffect(() => {
    if (user) {
      setItems([
        {
          key: '1',
          label: <Link to={`/profile/${user?.id}`}>
            Profile
          </Link>,
        },
        {
          key: '2',
          label: <Button type={"primary"} danger={true} onClick={handelLogout}>Logout</Button>,
        },
      ]);
    } else {
      setItems([
        {
          key: '1',
          label: <Link to={"/sign_up"}>Sign Up</Link>

        },
        {
          key: '2',
          label: <Link to={"/login"}>Login</Link>
        },
      ]);
    }
  }, [user]); // Re-run this effect when the user changes
  // Determine which image to use (either user's avatar or the default image)
  const avatarSrc = user?.profile_image_url || defaultImg;

  return (
    <div className={"cont"}>
      <div className={"MainContainer"}>
        <div className="navBar">
          <div className="navBarLogo">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
              alt="Logo"
            />
          </div>
          <div className={"SearchField"}>
            <Input.Search
              placeholder="Search"
              allowClear={true}
              className={"InputField"}
            />
          </div>
          {!user && <Dropdown trigger={["click"]} menu={{items}} className={"ProfileTag"}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar
                src={avatarSrc} // Using the computed avatar source
                style={{backgroundColor: "#f56a00", cursor: "pointer"}}
                size={40}
                shape={"circle"}
              />
            </a>
          </Dropdown>}
          {user && <Link to={`/profile/${user?.id}`}>
            <Avatar
              src={avatarSrc} // Using the computed avatar source
              style={{backgroundColor: "#f56a00", cursor: "pointer"}}
              size={40}
              shape={"circle"}
            />
          </Link>}

        </div>
      </div>
    </div>
  );
}
