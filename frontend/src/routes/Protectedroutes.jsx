import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { ShopContext } from "../Context/ShopContext";

const Protectedroutes = ({ children }) => {
  const { token } = useContext(ShopContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protectedroutes;
