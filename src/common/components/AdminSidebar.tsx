import { NavLink } from "react-router-dom";
import { FaUsers, FaUserCog, FaUserCheck, FaCog, FaUser } from "react-icons/fa";
import ROUTES from "../../server/endpoints/routes";
import "./AdminSidebar.css";
import { useContext } from "react";
import { AuthContext } from "../../auth";

const AdminSidebar = () => {
  const { roles } = useContext(AuthContext)!;

  const hasRole = (role: string) => {
    return roles.includes(role);
  };

  const isAdmin = hasRole("admin");
  const isProviderAdmin = hasRole("provider_admin");
  const isRegularUser = !isAdmin && !isProviderAdmin;

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <FaUserCog size="32px" />
        <h3>
          {isAdmin && "Admin Dashboard"}
          {isProviderAdmin && "Provider Dashboard"}
          {!isAdmin && !isProviderAdmin && "User Dashboard"}
        </h3>
      </div>
      <div className="sidebar-menu">
        {(isAdmin || isProviderAdmin) && (
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
        )}
        {isAdmin && (
          <>
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
          </>
        )}
        {isRegularUser && (
          <NavLink
            to={ROUTES.USER_ROLE.ROOT}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaUser size="20px" />
            <span>Role Promotion</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
