import { Outlet } from "react-router-dom";
import NavTop from "../components/NavTop";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => (
  <>
    <NavTop />
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-3 col-lg-2 p-0 bg-light border-end">
          <Sidebar />
        </aside>
        <main className="col-12 col-md-9 col-lg-10 p-3 p-lg-4 bg-body-tertiary">
          <Outlet />
        </main>
      </div>
    </div>
  </>
);

export default DashboardLayout;
