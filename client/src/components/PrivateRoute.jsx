import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) {
    // Optionally, render a loading indicator while authentication is being checked
    return <div>Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
