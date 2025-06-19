import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AvatarMenu } from "./AvatarMenu";

export const NavBar = () => {
  useEffect(() => {
    document.body.style.paddingTop = "72px";
    return () => {
      document.body.style.paddingTop = "0";
    };
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/res", label: "Restruction", icon: "🏗️" },
    { to: "/library", label: "Library", icon: "📚" },
    // { to: "/history", label: "History", icon: "⏱️" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4">
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/public/logo-cntt2021.png"
            alt="Logo CNTT 2021"
            className="w-12 h-12 rounded-lg shadow-md hover:shadow-blue-500/20 transition-all duration-300
              group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span
              className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent
              group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300"
            >
              VR Travel
            </span>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              Explore Virtual Reality
            </span>
          </div>
        </div>

        <ul className="flex items-center gap-2 lg:gap-6">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200
                  hover:scale-105
                  ${
                    location.pathname === item.to
                      ? "bg-blue-500/10 text-blue-400 shadow-sm shadow-blue-500/10"
                      : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="ml-6 pl-6 border-l border-gray-800">
            <AvatarMenu />
          </li>
        </ul>
      </div>
    </nav>
  );
};
