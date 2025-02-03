import {Button, Form, Image, Input, message} from "antd";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function LogInPage() {

  const [cookies, setCookies] = useCookies(["jwt"])
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      window.location.href = "/"
    }
  }, [cookies.jwt]);
  const [email, setEmail] = useState("");
  const handelSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/password", {
        user: {email}
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        message.success("Reset password link sent to your email");

      }
    } catch (error) {
      message.error("Something went wrong")
    }
  }

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
        <h1>Reset Password</h1>
        <div className={"form"}>
          <Form layout={"vertical"}>
            <Form.Item label={"Email"} name="email" rules={[{required: true, message: 'Please input your email!'}]}
                       value={email} onChange={(e) => {
              setEmail(e.target.value);
            }}>
              <Input type="email" placeholder="Email" className={"inputField"}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={handelSubmit}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>

  )
}