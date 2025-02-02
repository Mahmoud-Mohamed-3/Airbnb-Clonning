import axios from "axios";

export const RemoveAccountApi = async (token) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/users`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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