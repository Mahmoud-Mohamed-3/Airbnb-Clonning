import axios from "axios";

export const ReserveApi = async (token, id) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:3000/api/v1/properties/${id}/reservations`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, response.data];
    }
  } catch (error) {
    if (error.response) {
      return [null, error.response.data];
    } else if (error.request) {
      // The request was made but no response was received
      return [null, {message: "No response received from the server"}];
    } else {
      // Something happened in setting up the request that triggered an Error
      return [null, {message: error.message}];
    }
  }
};