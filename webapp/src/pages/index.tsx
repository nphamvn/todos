import { useAuth0 } from "@auth0/auth0-react";
import LoginComponent from "../components/LoginComponent";
import Home from "../components/Home";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <LoginComponent />;
  }
  return <Home />;
}
