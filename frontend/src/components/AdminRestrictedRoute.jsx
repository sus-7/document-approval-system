import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Roles } from "../../utils/enums";
const AdminRestrictedRoute = ({ children }) => {
  const { loggedInUser, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  return loggedInUser && loggedInUser.role === Roles.ADMIN ? (
    children
  ) : (
    <h2>
      You are not authorized to access this page.
      <br />
      <NavLink to="/" className={"text-sky-500 underline"}>
        Go to Home
      </NavLink>
    </h2>
  );
};

export default AdminRestrictedRoute;
