import React from "react";
import { Route, Routes } from "react-router-dom";
import UserTable from "../pages/UserTable";
import UserForm from "../pages/UserForm";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserTable/>}/>
      <Route path="/user-form" element={<UserForm/>}/>
    </Routes>
  );
};

export default AllRoutes;
