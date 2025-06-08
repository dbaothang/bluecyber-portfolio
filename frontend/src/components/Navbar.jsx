import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiSettings, FiHome } from "react-icons/fi";
import authStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = authStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          DevPort
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to={`/portfolio/${user?._id || user?.id}`} // Sửa ở đây
                className="flex items-center gap-1 text-gray-700 hover:text-primary"
              >
                <FiHome />
                <span>Portfolio</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-1 text-gray-700 hover:text-primary"
              >
                <FiSettings />
                <span>Settings</span>
              </Link>
              <div className="flex items-center gap-2">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-gray-500" />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
