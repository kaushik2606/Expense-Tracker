import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavTop = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="navbar bg-white border-bottom">
      <div className="container-fluid px-3 px-lg-4">
        <Link to="/dashboard" className="navbar-brand fw-semibold mb-0">
          Expense Tracker
        </Link>
        <div className="d-flex align-items-center gap-3">
          <Link to="/dashboard/profile" className="text-decoration-none text-body">
            {user?.name || user?.email}
          </Link>
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavTop;
