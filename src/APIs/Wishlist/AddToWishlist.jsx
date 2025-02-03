import axios from "axios";

export const AddToWishlistApi = async (token, item_id) => {
  if (!token) {
    return [null, "No Token"];
  }
  try {
    const response = await axios.post(
      "http://127.0.0.1:3000/api/v1/wishlists",
      {
        property_id: item_id,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    if (response.status === 200) {
      return [response.data, null];
    }
  } catch (error) {
    return [null, error.response ? error.response.data : "Error"];
  }
};
