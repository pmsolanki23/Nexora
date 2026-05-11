// src/Components/RouteTransitionProvider.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const RouteTransitionProvider = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); // duration of fake "route loading" (adjust if needed)

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );
};

export default RouteTransitionProvider;
