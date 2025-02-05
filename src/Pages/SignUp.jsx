import {useEffect, useState} from "react";
import {Button, Form, Image, Input, message, Upload} from "antd";
import "../css/login_and_sign_in_page.css";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Link} from "react-router-dom";

export default function SignUp() {
  const [fileList, setFileList] = useState([]);
  const [cookies, setCookies] = useCookies([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (cookies.jwt) {
      window.location.href = "/";
    }
  }, [cookies]);

  const handleFileChange = ({fileList: newFileList}) => setFileList(newFileList);

  const beforeUpload = (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isLt3M = file.size / 1024 / 1024 < 3;

    if (!isImage) {
      message.error("You can only upload JPG/PNG files!");
    }
    if (!isLt3M) {
      message.error("File must be smaller than 3MB!");
    }

    return isImage && isLt3M;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    formData.append("user[first_name]", firstName);
    formData.append("user[last_name]", lastName);

    if (fileList.length > 0) {
      formData.append("user[profile_image]", fileList[0].originFileObj);
    }

    try {
      const response = await axios.post("http://127.0.0.1:3000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        message.success("Please Check Your Email To Verify Your Account 🧐");
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Email has already been taken or an unexpected error occurred. Please try again.";
      message.error(errorMessage);
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
        <h1>Sign Up</h1>
        <div className={"form"}>
          <Form layout={"vertical"} onFinish={handleSubmit}>
            <Form.Item
              label={"First Name"}
              name="first_name"
              rules={[{required: true, message: "Please input your first name!"}]}
            >
              <Input
                placeholder="First Name"
                className={"inputField"}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label={"Last Name"}
              name="last_name"
              rules={[{required: true, message: "Please input your last name!"}]}
            >
              <Input
                placeholder="Last Name"
                className={"inputField"}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label={"Email"}
              name="email"
              rules={[{required: true, message: "Please input your email!"}]}
            >
              <Input
                type="email"
                placeholder="Email"
                className={"inputField"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label={"Password"}
              name="password"
              rules={[{required: true, message: "Please input your password!", min: 6}]}
            >
              <Input
                type="password"
                placeholder="Password"
                className={"inputField"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item label={"Your Profile Image (optional)"}>
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                accept=".jpg,.jpeg,.png"
              >
                <Button>Upload Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button className={"btn"} type="primary" htmlType="submit"
                      style={{':hover': {backgroundColor: "#FF5A5FFF"}}}>
                Sign Up
              </Button>
            </Form.Item>
            <Link to={"/login"}>Already Have An Account?</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}