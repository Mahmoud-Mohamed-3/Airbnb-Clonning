import axios from "axios";

export const GetPropertyOwnerApi = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/api/v1/users/${id}/owner`)
    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, response.data];
    }
  } catch (error) {
    return [null, {message: error.message}];
  }
}