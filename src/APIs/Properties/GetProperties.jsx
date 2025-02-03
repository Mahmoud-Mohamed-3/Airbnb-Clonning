import axios from "axios";

export const GetProperties = async (token) => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:3000/api/v1/properties",
      {
        headers: {
          Authorization: token,
        },
      },
    );
    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, "Unexpected response status"];
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [null, error.message || "An error occurred"];

  }
};
