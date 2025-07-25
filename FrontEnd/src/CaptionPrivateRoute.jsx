import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const CaptionPrivateRoute = () => {
  const token = localStorage.getItem("capToken");
  return token ? <Outlet /> : <Navigate to="/captionSignUp" />;
};

export default CaptionPrivateRoute;
