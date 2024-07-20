import { useAuth0 } from "@auth0/auth0-react";

export default function LoginComponent() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="text-center mt-10">
      <h1>Welcome</h1>
      <button
        className="bg-blue-500 text-white px-3 py-1 mt-4"
        onClick={() => {
          loginWithRedirect();
        }}
      >
        Login
      </button>
    </div>
  );
}
