import axios from "axios";

export const GetUserWishlistedProperties = async (id, token) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/v1/users/${id}/wishlisted_properties`,
      { headers: { Authorization: token } },
    );
    if (response.status === 200) {
      return [response.data, ""];
    } else {
      return [[], "Error"];
    }
  } catch (error) {
    return [[], "Error"];
  }
};
