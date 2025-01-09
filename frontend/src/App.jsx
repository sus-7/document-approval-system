import { Routes, Route } from "react-router-dom";
import Login from  "../src/components/login";
import Register from "../src/components/Register";
import ForgotPassword from "./components/ForgotPassword";
import RemarkUI from "./components/RemarkUI";
import Notifications from "./components/Notifications";
import ManageUsers from "./components/ManageUsers";
import PaDashboard from "./components/PaDashboard";
import History from "./components/History";
const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/remark-pdf" element={<RemarkUI />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users/manage" element={<ManageUsers />} />
        <Route path="/dashboard" element={<PaDashboard/>} />
        <Route path="/history" element={<History/>} />
        
      </Routes>
    
  );
};

export default App;