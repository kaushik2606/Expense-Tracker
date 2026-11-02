import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Home", end: true },
  { to: "/dashboard/income", label: "Income" },
  { to: "/dashboard/expense", label: "Expenses" },
  { to: "/dashboard/profile", label: "Profile" },
];

const Sidebar = () => (
  <nav className="p-3" aria-label="Main navigation">
    <p className="small fw-semibold text-uppercase text-body-secondary px-2 mb-2">
      Menu
    </p>
    <div className="nav nav-pills flex-column gap-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : "text-body"}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Sidebar;
