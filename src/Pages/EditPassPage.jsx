import {Button, Form, Image, Input, message} from "antd";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

export default function EditPasswordPage() {
  const [cookies, setCookies] = useCookies(["jwt"]);
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (cookies.jwt) {
      window.location.href = "/";
    }
  }, [cookies]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/users/password",
        {
          user: {
            password: values.password,
            password_confirmation: values.password_confirmation,
            reset_password_token: token,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        message.success("Password updated successfully");
        navigate("/login");
      }
    } catch (error) {
      message.error("Something went wrong");
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
        <h1>New Password</h1>
        <div className={"form"}>
          <Form
            layout={"vertical"}
            onFinish={handleSubmit}
          >
            <Form.Item
              label={"Password"}
              name="password"
              rules={[
                {required: true, message: "Please input your password!"},
                {min: 6, message: "Password must be at least 6 characters long."},
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Password"
                className={"inputField"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label={"Confirm Your Password"}
              name="password_confirmation"
              rules={[
                {required: true, message: "Please confirm your password!"},
                {min: 6, message: "Password confirmation must be at least 6 characters long."},
                {
                  validator: (_, value) =>
                    value && value === password
                      ? Promise.resolve()
                      : Promise.reject("Passwords do not match"),
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Confirm Password"
                className={"inputField"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
