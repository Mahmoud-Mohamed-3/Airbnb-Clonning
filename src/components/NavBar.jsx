import defaultImg from "../assets/balnk_user.png";
import "../css/navBar.css";
import {Avatar, Button, Dropdown, message} from "antd";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogoutApi} from "../APIs/User/Logout.jsx";

// eslint-disable-next-line react/prop-types
export default function NavBar({user, setUser, setState}) {
  const [items, setItems] = useState([]);
  const [cookies, setCookies, removeCookie] = useCookies([]);
  const navigate = useNavigate();

  async function handelLogout() {
    await LogoutApi(cookies.jwt);

    removeCookie("jwt", {path: "/", domain: "localhost"});
    setUser(null);
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";

    setTimeout(() => {
      window.location.href = "/login";
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
  }, [user]);

  const avatarSrc = user?.profile_image_url || defaultImg;

  useEffect(() => {
    sessionStorage.setItem("state", "");
  }, []);

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
          {!user && <Dropdown trigger={["click"]} menu={{items}} className={"ProfileTag"}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar
                src={avatarSrc}
                style={{backgroundColor: "#f56a00", cursor: "pointer"}}
                size={40}
                shape={"circle"}
              />
            </a>
          </Dropdown>}
          {user &&
            <div style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "50px",
            }}>
              <button className={"CreateNewBtn"} onClick={() => {
                sessionStorage.setItem("state", "create");
                setState("create");
                setTimeout(() => {
                  navigate("/property/create_new");
                }, 1000);
              }}>
                Create A New Property
              </button>
              <Link to={`/profile/${user?.id}`}>
                <Avatar
                  src={avatarSrc}
                  style={{backgroundColor: "#f56a00", cursor: "pointer"}}
                  size={40}
                  shape={"circle"}
                />
              </Link>
            </div>}
        </div>
      </div>
    </div>
  );
}
