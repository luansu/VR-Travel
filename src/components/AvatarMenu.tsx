import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AvatarMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Login
      </button>
    );
  }

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center gap-2 group">
        <img
          src="./src/assets/logo.jpg"
          alt="Avatar"
          className="w-15 h-15 rounded-full group-hover:scale-110 transition-transform duration-200"
        />
        <span className="text-sm font-medium">{user.username}</span>
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md p-2 z-10"
      >
        <a
          href="/analytics"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Analytics
        </a>
        <a
          href="/engagement"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Engagement
        </a>
        <a
          href="/security"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Security
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded text-left"
        >
          <LogOut size={16} />
          Logout
        </button>
      </PopoverPanel>
    </Popover>
  );
};
