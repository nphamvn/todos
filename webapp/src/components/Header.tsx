import { useAuth0 } from "@auth0/auth0-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useOutsideClick from "../hooks/useOutsideClick";

export default function Header() {
  const { user, logout } = useAuth0();
  const dropdownRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  useOutsideClick(dropdownRef, () => {
    setDropdownVisible(false);
  });

  const handleLogoutClick = async () => {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div className="px-2 py-1 flex justify-between">
      <Link to=".">ToDo</Link>
      <div className="relative">
        <button
          onClick={() => {
            setDropdownVisible((prev) => !prev);
          }}
          className="flex items-center"
        >
          <img src={user?.picture} className="w-6 h-6" />
          {user?.name}
        </button>
        {dropdownVisible && (
          <div
            ref={dropdownRef}
            className="absolute bg-white border w-42 right-0 shadow rounded shadow-neutral-200 p-2"
          >
            <div className="text-sm px-2">{user?.email}</div>
            <hr className="my-2" />
            <button
              className="w-full text-start rounded hover:bg-neutral-100 px-2 py-1"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
