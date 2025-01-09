import { Routes, Route } from "react-router-dom";
import Login from "../src/components/login";
import Register from "../src/components/Register";
import ForgotPassword from "./components/ForgotPassword";
import RemarkUI from "./components/RemarkUI";
import Notifications from "./components/Notifications";
import ManageUsers from "./components/ManageUsers";
import ApproverDashboard from "./components/ApproverDashboard";
import History from "./components/History";
import EditProfile from "./components/EditProfile";
import OTPUI from "./components/OTPUI";
import ProfileDashboard from "./components/ProfileDashboard";
import { AuthProvider } from "../src/contexts/AuthContext";
import ApprovalPage from "./components/ApprovalPage";
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/remark-pdf" element={<RemarkUI />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users/manage" element={<ManageUsers />} />
        <Route path="/page" element={<ApprovalPage />} />
        <Route path="/dashboard" element={<ApproverDashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit/profile" element={<EditProfile />} />
        <Route path="/otp/verify" element={<OTPUI />} />
        <Route path="/profile" element={<ProfileDashboard />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
