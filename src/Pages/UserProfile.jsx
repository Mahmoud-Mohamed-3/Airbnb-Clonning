import {useEffect, useState} from "react";
import {Button, Form, Image, Input, message, Modal, Upload} from "antd";
import {useCookies} from "react-cookie";
import {useOutletContext} from "react-router-dom";
import "../css/User_profile.css";
import axios from "axios";
import {RemoveAccountApi} from "../APIs/User/RemoveAccount.jsx";

export default function UserProfile() {
  const {UserProfile, setUserProfile} = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [cookies, removeCookie] = useCookies([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fileList, setFileList] = useState([]);
  import default_img from "../assets/balnk_user.png"
  const [profileImage, setProfileImage] = useState(default_img);
  useEffect(() => {
    if (cookies.jwt) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);
  useEffect(() => {
    if (UserProfile) {
      setUserInfo(UserProfile);
      setFirstName(UserProfile.first_name || "");
      setLastName(UserProfile.last_name || "");
      setProfileImage(UserProfile.profile_image_url || default_img);
    }
  }, [UserProfile]);

  const handleFileChange = ({fileList: newFileList}) => {
    if (newFileList.length > 0) {
      const newImageUrl = URL.createObjectURL(newFileList[0].originFileObj);
      setProfileImage(newImageUrl);
    }

    setFileList(newFileList);
  };
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

  const handleUpdateProfile = async () => {
    if (!userInfo) return;

    const formData = new FormData();

    formData.append("user[first_name]", firstName || userInfo.first_name);
    formData.append("user[last_name]", lastName || userInfo.last_name);

    if (fileList.length > 0) {
      formData.append("user[profile_image]", fileList[0].originFileObj);
    } else {
      formData.append("user[profile_image_url]", userInfo.profile_image_url);
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/api/v1/users/${userInfo.id}/update_profile`,
        formData,
        {
          headers: {
            'Authorization': `${cookies.jwt}`,
          }
        }
      );

      if (response.data) {
        setUserProfile(response.data);
        message.success("Profile updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      } else {
        message.error("Failed to update profile!");
        console.error("Error updating profile:", response.error);
      }
    } catch (err) {
      message.error("An unexpected error occurred.");
      console.error("Unexpected error:", err);
    }
  };
  const handelRemoveAccount = () => {
    Modal.confirm({
      title: "Are you sure you want to remove your account?",
      content: "This action cannot be undone. Your account will be permanently deleted.",
      okText: "Yes, Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const [response, error] = await RemoveAccountApi(cookies.jwt);
        if (response) {
          message.success("Account removed successfully");
          removeCookie("jwt", {path: "/", domain: "localhost"});

          document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        } else {
          message.error(error.message || "Failed to remove account");
        }
      },
      onCancel: () => {
        window.location.reload();
      },
    });
  }
  return (
    <div className="UserProfileMainContainer">
      <div className="UserProfileContainer">
        <div className="UserProfileImageContainer">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".jpg,.jpeg,.png"
          >
            <Image
              src={profileImage}
              alt="profile_image"
              className="UserProfileImage"
              style={{borderRadius: "50%"}}
              preview={false}
              width={200}
              height={200}
            />
          </Upload>
          <div>Change Your Profile Image</div>
        </div>

        <div className="UserNameContainer">
          <Form layout={"inline"} className={"InputsLayout"}>
            <Form.Item>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </Form.Item>
            <Form.Item>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </Form.Item>
          </Form>
        </div>

        <div className="UpdateButton">
          <Button type="primary" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </div>


        <div className={"RemoveAccount"}>
          <Button danger={true} type={"primary"} onClick={handelRemoveAccount}>Remove Account</Button>
        </div>
      </div>
    </div>
  );
}
