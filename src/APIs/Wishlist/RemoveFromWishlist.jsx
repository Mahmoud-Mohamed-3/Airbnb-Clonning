import axios from "axios";

export const RemoveFromWishlistApi = async (token, item_id) => {
  if (!token) {
    return [[], "No Token"];
  }
  try {
    const response = await axios.delete(
      `http://127.0.0.1:3000/api/v1/wishlists/${item_id}`,
      {
        headers: {
          Authorization: token,
        },
        data: {
          property_id: item_id,
        },
      },
    );
    if (response.status === 200) {
      return ["Item removed from wishlist", ""];
    }
  } catch (error) {
    return [[], "Error"];
  }
};
