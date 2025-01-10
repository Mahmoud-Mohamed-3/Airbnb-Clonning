import axios from "axios";

export const LogoutApi = async (token) => {
  if(!token) {
    return [[], "No Token"];
  }
  try {
    const response = await axios.delete("http://127.0.0.1:3000/users/sign_out",{
      headers:{
        "Authorization": token
      }
    })
    if(response.status===200){
      return ["Log out successful", ""];

    }else {
      return [[], "Error"];
    }
  }catch(e) {
    return [[], "Error"];
  }
}