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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/sign_up" element={<SignUp/>}/>
      <Route path="/login" element={<LogInPage/>}/>
      <Route path="/reset_password" element={<ForgetPassword/>}/>
      <Route path="/edit_password" element={<EditPass/>}/>
      <Route path="/confirm_account" element={<ConfirmPage/>}/>
      <Route
        path="/property/:city/:id/:owner/:user_id"
        element={<ShowProperty/>}
      />
      <Route path="/reservation/:property_id" element={<ConfirmReservationPage/>}/>
      <Route element={<UserProfilePageLayout/>}>
        <Route path={'/profile/:id'} element={<UserProfile/>}/>
        <Route path={'/profile/received_reservations/:id'} element={<ReceivedReservations/>}/>
        <Route path={'/profile/wishlist/:id'} element={<Wishlist/>}/>
        <Route path={"/profile/requests/:id"} element={<YourRequests/>}/>
      </Route>
    </Routes>
  );
}
