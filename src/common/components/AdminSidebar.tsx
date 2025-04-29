import { NavLink } from "react-router-dom";
import { FaUsers, FaUserCog, FaUserCheck, FaCog } from "react-icons/fa";
import ROUTES from "../../server/endpoints/routes";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <FaUserCog size="28px" />
        <h3>Admin Panel</h3>
      </div>
      <div className="sidebar-menu">
        <NavLink
          to={ROUTES.MANAGED_PIDS.ROOT}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          end
        >
          <FaCog size="20px" />
          <span>Manage PIDs</span>
        </NavLink>
        <NavLink
          to={ROUTES.USER_ROLE.USERS_TABLE}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaUsers size="20px" />
          <span>View All Users</span>
        </NavLink>
        <NavLink
          to={ROUTES.USER_ROLE.REQUESTS}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaUserCheck size="22px" />
          <span>Role Requests</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
