import axios from "axios";

export const loginApi = async (bodyObject) => {
  try {
    const response = await axios.post(`http://127.0.0.1:3000/users/sign_in`, bodyObject, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const token = response.headers['authorization'];
    return [response.data, token, ''];


  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.errors?.email?.[0] || errorData?.message || "Wrong email or password";
    return ['', errorMessage];
  }
};
