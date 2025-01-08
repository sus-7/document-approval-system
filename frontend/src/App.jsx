import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from  "../src/components/login";
import Register from "../src/components/Register";
import ForgotPassword from "./components/ForgotPassword";
import RemarkUI from "./components/RemarkUI";
import Notifications from "./components/Notifications";
import ManageUsers from "./components/ManageUsers";
import CM_New from "./components/CM_New";
const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/remark-pdf" element={<RemarkUI />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users/manage" element={<ManageUsers />} />
        <Route path="cm-new" element={<CM_New/>} />
        
      </Routes>
    
  );
};

export default App;