import {Route, Routes} from "react-router-dom";
import SignUp from "../Pages/SignUp.jsx";
import HomePage from "../Pages/HomePage.jsx";
import LogInPage from "../Pages/LogInPage.jsx";
import ForgetPassword from "../Pages/ForgetPassword.jsx";
import EditPass from "../Pages/EditPassPage.jsx";
import ConfirmPage from "../Pages/ConfirmPage.jsx";
import ShowProperty from "../Pages/ShowProperty.jsx";
import ReceivedReservations from "../Pages/ReceivedReservations.jsx";
import ConfirmReservationPage from "../Pages/ConfirmReservationPage.jsx";
import UserProfilePageLayout from "../Pages/UserProfilePageLayout.jsx";
import UserProfile from "../Pages/UserProfile.jsx";
import Wishlist from "../Pages/Wishlist.jsx";
import YourRequests from "../Pages/Requests.jsx";
import YourProperties from "../Pages/YourProperties.jsx";
import CreateNewProperty from "../Pages/CreateNewProperty.jsx";
import {useState} from "react";
import ShowPropertyForOwner from "../Pages/ShowPropertyForOwner.jsx"; // Ensure useState is imported

export default function AppRoutes() {
  const [state, setState] = useState('');

  return (
    <Routes>
      <Route path="/" element={<HomePage setState={setState}/>}/>
      <Route path="/sign_up" element={<SignUp/>}/>
      <Route path="/login" element={<LogInPage/>}/>
      <Route path="/reset_password" element={<ForgetPassword/>}/>
      <Route path="/edit_password" element={<EditPass/>}/>
      <Route path="/confirm_account" element={<ConfirmPage/>}/>
      <Route
        path="/property/:city/:id/:owner/:user_id"
        element={<ShowProperty setState={setState}/>}
      />
      <Route path={'/property/create_new'} element={<CreateNewProperty state={state}/>}/>

      <Route path="/reservation/:property_id" element={<ConfirmReservationPage/>}/>
      <Route element={<UserProfilePageLayout/>}>
        <Route path={'/profile/:id'} element={<UserProfile/>}/>
        <Route path={'/profile/received_reservations/:id'} element={<ReceivedReservations/>}/>
        <Route path={'/profile/wishlist/:id'} element={<Wishlist/>}/>
        <Route path={"/profile/requests/:id"} element={<YourRequests/>}/>
        <Route path={"/profile/properties/:id"} element={<YourProperties setState={setState}/>}/>
        <Route path={'/profile/property/:id'} element={<ShowPropertyForOwner/>}/>
      </Route>
    </Routes>
  );
}
