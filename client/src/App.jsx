import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Trial from "./pages/Trial";
import TrialDetails from "./pages/TrialDetails";
import OTPVerification from "./pages/OTPVerification";
import TrialSuccess from "./pages/TrialSuccess";
import Product from "./pages/ProductPortal.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
function App() {
  return (
    <>
   <Navbar/> 
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/trial" element={<Trial />} />

      <Route path="/trial-details" element={<TrialDetails />} />

      <Route path="/verify-otp" element={<OTPVerification />} />

      <Route path="/trial-success" element={<TrialSuccess />} />
      
      <Route path="/product-portal" element={<Product />} />

    </Routes>
    <Footer/>
</>
  );
}

export default App;
