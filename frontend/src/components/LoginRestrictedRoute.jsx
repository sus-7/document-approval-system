import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const LoginRestrictedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/" />;
};

export default LoginRestrictedRoute;
