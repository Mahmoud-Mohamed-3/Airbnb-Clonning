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
      <Route path={"/received_reservations"} element={<ReceivedReservations/>}/>
      {/*<Route path={"/reservation/:property_id/start_date=:start_date/:end_date/:total_price"}*/}
      {/*       element={<ConfirmReservationPage/>}/>*/}

      <Route path="/reservation/:property_id" element={<ConfirmReservationPage/>}/>

    </Routes>
  );
}
