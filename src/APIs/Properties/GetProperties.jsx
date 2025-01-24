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
      return [response.data, null]; // Return data and no error
    } else {
      return [null, "Unexpected response status"]; // Handle unexpected status codes
    }
  } catch (error) {
    console.error("Error fetching properties:", error); // Log the actual error
    return [null, error.message || "An error occurred"];
    // Return null for data and the error message
  }
};
