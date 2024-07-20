import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
  },
]);

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/health");
      const text = await response.text();
      console.log(text);
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/whoami", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        console.log(text);
      })();
    }
  }, [isAuthenticated]);

  return <RouterProvider router={router} />;
}

export default App;
