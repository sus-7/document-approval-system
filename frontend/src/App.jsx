import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from  "../src/components/Login";
import Register from "../src/components/Register";
import ForgotPassword from "./components/ForgotPassword";
import RemarkUI from "./components/RemarkUI";
import Notifications from "./components/Notifications";
import ManageUsers from "./components/ManageUsers";
import History from "./components/History";
import EditProfile from "./components/EditProfile";

const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/remark-pdf" element={<RemarkUI />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/manage/users" element={<ManageUsers />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        
        
      </Routes>
    
  );
};

export default App;