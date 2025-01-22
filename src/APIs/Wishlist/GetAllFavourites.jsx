import axios from "axios";

export const GetAllFavourites = async (token) => {
  if (!token) {
    return [[], "No Token"];
  }
  try {
    const response = await axios.get("http://127.0.0.1:3000/api/v1/wishlists", {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      return [response.data, ""];
    }
  } catch (error) {
    return [[], "Error"];
  }
};
