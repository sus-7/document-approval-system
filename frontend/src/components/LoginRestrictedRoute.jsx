import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const LoginRestrictedRoute = ({ children }) => {
  const { loggedInUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return loggedInUser ? children : <Navigate to="/" />;
};

export default LoginRestrictedRoute;
