import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiFolder, FiLogIn, FiCheckSquare, FiCreditCard, FiLogOut, FiX } from "react-icons/fi";

function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Clients", path: "/clients", icon: <FiUsers /> },
    { name: "Projects", path: "/projects", icon: <FiFolder /> },
    { name: "Logins", path: "/logins", icon: <FiLogIn /> },
    { name: "Tasks", path: "/tasks", icon: <FiCheckSquare /> },
    { name: "Payments", path: "/payments", icon: <FiCreditCard /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/Main_login");
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col p-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-extrabold tracking-wide">Freelance Admin</h2>
        <button onClick={onClose} className="md:hidden text-white hover:text-gray-300">
          <FiX size={22} />
        </button>
      </div>

      <ul className="space-y-2 flex-1">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 shadow-md"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-all duration-300"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
