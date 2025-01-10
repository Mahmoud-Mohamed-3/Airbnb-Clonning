import defaultImg from "../assets/balnk_user.png";
import "../css/navBar.css";
import {Avatar, Button, Dropdown, Input, message} from "antd";
import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import {LogoutApi} from "../APIs/User/Logout.jsx";

// eslint-disable-next-line react/prop-types
export default function NavBar({ user ,setUser}) {
  const [items, setItems] = useState([]);
  const [cookies, setCookies,removeCookie] = useCookies([]);

    async function handelLogout (){
      const [response,error]=await LogoutApi(cookies.jwt);
      removeCookie('jwt');
    setUser(null);
    if(response){
      message.success("Logout successful!")
      setInterval(()=>{
        window.location.href = "/login";
      },2000)
    }
    if(error){
      message.success("Logout successful!")
      setInterval(()=>{
        window.location.href = "/login";
      },2000)
    }
    }
  useEffect(() => {
    if (user) {
      setItems([
        {
          key: '1',
          label: 'Profile',
        },
        {
          key: '2',
          label: 'Settings',
        },
        {
          key: '3',
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
  const avatarSrc = user?.avatar_url || defaultImg;

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
          <Dropdown trigger={["click"]} menu={{ items }} className={"ProfileTag"}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar
                src={avatarSrc} // Using the computed avatar source
                style={{ backgroundColor: "#f56a00", cursor: "pointer" }}
                size={40}
                shape={"circle"}
              />
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
