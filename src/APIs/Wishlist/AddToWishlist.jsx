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
          // content: "application/json",
        },
      },
    );
    if (response.status === 200) {
      return [response.data, null]; // Return the response data and no error
    }
  } catch (error) {
    return [null, error.response ? error.response.data : "Error"]; // Return the error response if available
  }
};
