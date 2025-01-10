import axios from "axios";

export const GetCurrentUserApi = async (token) => {
 if(!token){
   return [[], "No Token" ];
 }
 try {
   const response = await axios.get("http://127.0.0.1:3000/api/v1/current_user",{
     headers:{
       "Authorization": token
     }
   });
   if(response.status===200){
      return [response.data, ""];
   }else{
     return [[], "Error"];
   }
 }catch (error){
   return [[], "Error"];
 }
}