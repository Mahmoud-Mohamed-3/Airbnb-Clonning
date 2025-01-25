import axios from "axios";

export const GetSinglePropertyApi = async (id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:3000/api/v1/properties/${id}`,
    );
    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, "Unexpected response status"];
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    return [null, error.message || "An error occurred"];
  }
};
