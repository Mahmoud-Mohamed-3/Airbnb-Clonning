import SideBar from "../components/SideBar.jsx";
import {Outlet, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GetAllUserInfoApi} from "../APIs/User/GetAllUserInfo.jsx";
import {useCookies} from "react-cookie";
import {Spin} from "antd";

export default function UserProfilePageLayout() {
  const [cookies] = useCookies([])
  const {id} = useParams()
  const [UserProfile, setUserProfile] = useState(null)
  useEffect(() => {

    async function fetchUserProfileInfo() {
      try {
        const [data, error] = await GetAllUserInfoApi(cookies.jwt, id);

        if (data) {
          setUserProfile(data);
        } else if (error.message === "You are not authorized to view this user") {
          window.location.href = "/";
        } else {
          console.error("Error fetching user:", error);
        }
      } catch (err) {
        console.error("An error occurred while fetching user:", err);
      }
    }

    fetchUserProfileInfo()
  }, [cookies.jwt, id])
  if (!UserProfile) {
    return <div
      style={{width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Spin size={"large"} spinning={true}/>
    </div>
  }
  return (
    <div style={{display: "flex", flexDirection: "row", gap: "50px"}}>
      <SideBar UserProfile={UserProfile} setUserProfile={setUserProfile}/>
      <Outlet context={{UserProfile, setUserProfile}}/>
    </div>
  )
}

