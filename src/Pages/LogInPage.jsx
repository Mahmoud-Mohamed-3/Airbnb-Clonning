import {Button, Form, Image, Input, message} from "antd";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {loginApi} from "../APIs/User/LoginApi.jsx";
import {Link, useNavigate} from "react-router-dom";

export default function LogInPage() {

  const [cookies , setCookies] = useCookies(["jwt"])
  const navigate=useNavigate();
  useEffect(() => {
    if(cookies.jwt){
      window.location.href = "/"
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    /* Initialize Google Sign-In */
    window.google.accounts.id.initialize({
      client_id: "572508878231-ritv9flo5nbv3rsbr480f7ommvfkl8a3.apps.googleusercontent.com",
      callback: handleGoogleLogin
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large" } // Customize as needed
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;
      // Send the token to your backend for verification
      const [apiResponse, token, error] = await loginApi({ google_token: idToken });

      if (apiResponse) {
        setCookies('jwt', token);
        message.success("Login successful! Redirecting to the home page...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (error) {
        message.error(error);
      } else {
        message.success("Check Your Email To Verify Your Account 🧐");
      }
    } catch (err) {
      message.error("An error occurred during Google login.");
    }
  };

  const handleSubmit = async () => {
    const [response, token, error] = await loginApi({
      user: { email, password },
    });

    if (response) {
      setCookies('jwt', token);
      message.success("Login successful! Redirecting to the home page...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else if (error) {
      // Display error message from API
      message.error(error);
    } else {
      // Fallback error message
      message.error("Wrong email or password");
    }
  };

  return (
    <div className={"mainFormContainer"}>
      <div className={"formContainer"}>
        <div className="logo">
          <Image
            src={"https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"}
            alt={"SiteLogo"}
            loading={"lazy"}
            preview={false}
          />
        </div>
        <h1>Login</h1>
        <div className={"form"}>
          <Form layout={"vertical"} onFinish={handleSubmit}>
            <Form.Item label={"Email"} name="email" rules={[{required: true, message: 'Please input your email!'}]}>
              <Input type="email" placeholder="Email" className={"inputField"} value={email} onChange={(e) => {
                setEmail(e.target.value)
              }}/>
            </Form.Item>
            <Form.Item label={"Password"} name="password"
                       rules={[{required: true, message: 'Please input your password!', min: 6}]}>
              <Input.Password type="password" placeholder="Password" className={"inputField"} value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                              }}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <div id="google-login-btn" style={{marginTop: "10px"}}></div>
            <div>
              <Link to={"/sign_up"}>
                Create Account ?</Link>
            </div>
            <Link to={"/reset_password"}>
              Forget Password ?</Link>
          </Form>
        </div>
      </div>
    </div>
  )
}
