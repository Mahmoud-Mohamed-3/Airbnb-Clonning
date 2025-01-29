import axios from "axios";

export const GetPropertyReviewsApi = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/api/v1/properties/${id}/reviews`);
    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, response.data];
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
