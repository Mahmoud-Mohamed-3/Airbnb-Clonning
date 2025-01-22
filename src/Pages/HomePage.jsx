import NavBar from "../components/NavBar.jsx";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { GetCurrentUserApi } from "../APIs/User/Current_user.jsx";
import Items from "../components/Items.jsx";

export default function HomePage() {
  const [cookies, setCookie] = useCookies([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (cookies.jwt) {
      async function fetchUser() {
        if (!cookies.jwt) {
          return;
        }
        const [data, error] = await GetCurrentUserApi(cookies.jwt);
        if (data) {
          setUser(data);
        } else {
          console.log(error);
        }
      }

      fetchUser();
    }
  }, [cookies.jwt]);
  // console.log(user)
  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Items user={user} />
    </>
  );
}
