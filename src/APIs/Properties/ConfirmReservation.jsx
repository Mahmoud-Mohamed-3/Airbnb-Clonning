import axios from "axios";

export const ConfirmReservationApi = async (token, id, bodyObject) => {
  try {

    const response = await axios.post(`http://localhost:3000/api/v1/reservations/${id}/update_status`, bodyObject, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    })
    if (response.status === 200) {
      return [response.data, null];
    } else {
      return [null, response.data];
    }

  } catch (error) {
    return [null, {message: error.message}];
  }

}