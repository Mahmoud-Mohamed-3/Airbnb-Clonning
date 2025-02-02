import axios from "axios";

export const GetAllUserInfoApi = async (token, id) => {
  if (!token) {
    return [null, {message: "No token provided"}];
  }
  try {
    const response = await axios.get(`http://127.0.0.1:3000/api/v1/users/${id}`, {
      headers: {
        Authorization: `${token}`,
      }
    })
    if (response.status === 200) {
      return [response.data, null];
    }
    if (response.status === 401) {
      return [null, {message: "Unauthorized"}];
    }
  } catch (error) {
    if (error.response) {
      return [null, error.response.data];
    } else if (error.request) {
      return [null, {message: "No response received from the server"}];
    } else {
      return [null, {message: error.message}];
    }
  }
}