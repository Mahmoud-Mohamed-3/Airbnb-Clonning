import {useEffect, useState} from "react";
import {Button, Form, Image, Input, message, Modal, Upload} from "antd";
import {useCookies} from "react-cookie";
import {useOutletContext} from "react-router-dom";
import default_img from "../assets/balnk_user.png";
import "../css/User_profile.css";
import axios from "axios";
import {RemoveAccountApi} from "../APIs/User/RemoveAccount.jsx";

export default function UserProfile() {
  const {UserProfile, setUserProfile} = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [cookies, removeCookie] = useCookies([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fileList, setFileList] = useState([]); // Image file state
  const [profileImage, setProfileImage] = useState(default_img); // Profile Image URL
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

  // Handle file change
  const handleFileChange = ({fileList: newFileList}) => {
    // If there's a new file selected, update the profile image preview
    if (newFileList.length > 0) {
      const newImageUrl = URL.createObjectURL(newFileList[0].originFileObj);
      setProfileImage(newImageUrl); // Update the profile image preview
    }

    setFileList(newFileList); // Update fileList state with the new file
  };

  // Validate file before upload
  const beforeUpload = (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isLt3M = file.size / 1024 / 1024 < 3; // File size < 3MB

    if (!isImage) {
      message.error("You can only upload JPG/PNG files!");
    }
    if (!isLt3M) {
      message.error("File must be smaller than 3MB!");
    }

    return isImage && isLt3M; // Only allow files that pass all validations
  };

  // Update Profile API Call
  const handleUpdateProfile = async () => {
    if (!userInfo) return;

    // Create FormData to send all fields
    const formData = new FormData();

    // Always send first_name and last_name, even if they haven't changed
    formData.append("user[first_name]", firstName || userInfo.first_name);
    formData.append("user[last_name]", lastName || userInfo.last_name);

    // If a new profile image is selected, append it
    if (fileList.length > 0) {
      formData.append("user[profile_image]", fileList[0].originFileObj); // Actual file
    } else {
      // If no new image is selected, send the existing image's URL (if needed by backend)
      formData.append("user[profile_image_url]", userInfo.profile_image_url);
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:3000/api/v1/users/${userInfo.id}/update_profile`,  // Your API URL
        formData,
        {
          headers: {
            'Authorization': `${cookies.jwt}`,  // Token for authentication
          }
        }
      );

      if (response.data) {
        setUserProfile(response.data); // Update global user profile context
        message.success("Profile updated successfully!");
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

          // Force expire cookie if necessary
          document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";

          setTimeout(() => {
            console.log("JWT after logout:", cookies.jwt); // Debugging
            window.location.href = "/login"; // Redirect after ensuring removal
          }, 500);
        } else {
          message.error(error.message || "Failed to remove account");
        }
      },
      onCancel: () => {
        // Optionally handle cancel action (e.g., logging or other actions)
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
