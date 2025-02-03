import axios from "axios";

export const RemovePropertyApi = async (propertyId, jwt) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/api/v1/properties/${propertyId}`, {
      headers: {
        Authorization: `${jwt}`,
      },
    })
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error.response.data;
  }
}