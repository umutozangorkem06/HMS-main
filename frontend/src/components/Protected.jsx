import React from "react";
import { Navigate } from "react-router-dom";

const Protected = ({ isSignedIn, children }) => {
  if (!isSignedIn) return <Navigate to="/login" />;
  return children;
};

export default Protected;
