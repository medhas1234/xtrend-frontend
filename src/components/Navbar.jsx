import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("xtrend-user"));

  const handleLogout = () => {
    localStorage.removeItem("xtrend-user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        X-TREND
      </Link>

      <div className="flex items-center gap-4">

        {!user && (
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        )}

        {user && (
          <>
            <span className="text-gray-600">
              Welcome, <span className="font-semibold">{user.name}</span>
            </span>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
