import axios from "axios";

export const UpdateUserApi = async (id, data, token) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:3000/api/v1/users/${id}/update_profile`,
      {data},
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json"
        },
      }
    );

    return {data: response.data, error: null};
  } catch (error) {
    if (error.response) {
      return {data: null, error: error.response.data};
    } else if (error.request) {
      return {data: null, error: {message: "No response received from the server"}};
    } else {
      return {data: null, error: {message: error.message}};
    }
  }
};
