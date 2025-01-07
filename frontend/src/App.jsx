import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from  "../src/components/Login";
import Register from "../src/components/Register";

const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    
  );
};

export default App;
