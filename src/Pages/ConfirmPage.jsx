import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { message, Spin } from "antd";

export default function ConfirmPage() {
  const [cookies] = useCookies([]);
  const location = useLocation();

  // Debugging: log the location
  console.log("Location Object: ", location);

  // Check if location is available before proceeding
  if (!location) {
    message.error("Location is undefined. Cannot proceed.");
    return null;
  }

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // Debug: log the token value
  console.log("Token: ", token);

  useEffect(() => {
    if (cookies.jwt) {
      window.location.href = "/"; // Redirect if the user is already logged in
    } else {
      if (!token) {
        message.error("Token is missing from the URL.");
        return;
      }

      const confirmAccount = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/confirmation?confirmation_token=${token}`
          );

          if (response.status === 200) {
            message.success("Account verified successfully. Redirecting to login page...");
            setTimeout(()=>{
              window.location.href = "/login";
            },2000)
          } else {
            message.success("Account verified successfully. Redirecting to login page...");
            setTimeout(()=>{
              window.location.href = "/login";
            },2000)
          }
        } catch (error) {
          message.error("An error occurred while verifying your account. Please try again.");
        }
      };

      confirmAccount();
    }
  }, [cookies.jwt, token]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Spin spinning={true} size={"large"} />
    </div>
  );
}
