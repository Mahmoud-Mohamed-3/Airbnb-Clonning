import axios from "axios";

export const GetOwnerReservationsApi = async (token) => {
  try {
    const response = await axios.get('http://127.0.0.1.:3000/api/v1/reservations/owner_reservations', {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status === 200) {
      return [response.data, null];
    }
  } catch (error) {
    if (error.response) {
      return [null, error.response.data];
    } else if (error.request) {
      return [null, {message: "No response received from the server"}];
    } else {
      return [null, {message: error.message}];
    }
  }
};