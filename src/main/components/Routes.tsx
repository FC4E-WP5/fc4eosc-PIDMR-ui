import { Routes as RoutesComponent, Route } from "react-router-dom";
import { KeycloakLogout, ProtectedRoute } from "../../auth";
import ROUTES from "../../server/endpoints/routes";
import HomePage from "../../pages/homepage/HomePage";
import Interoperability from "../../pages/about/Interoperability";
import AcceptableUse from "../../pages/about/AcceptableUse";
import Privacy from "../../pages/about/Privacy";
import Terms from "../../pages/about/Terms";
import Disclaimer from "../../pages/about/Disclaimer";
import Cookies from "../../pages/about/Cookies";
import ManagedPids from "../../pages/managed-pids/ManagedPids";
import AddEditProvider from "../../pages/managed-pids/AddEditProvider";
import UserRole from "../../pages/user-role/UserRole";
import UserRoleGuide from "../../pages/user-role/UserRoleGuide";
import UsersTable from "../../pages/user-role/UsersTable";
import UserRoleRequests from "../../pages/user-role/UserRoleRequests";
import SupportedPids from "../../pages/supported-pids/SupportedPids";
import PidDetail from "../../pages/supported-pids/PidDetail";
import NotFound from "../../pages/not-found/NotFound";

const Routes = () => {
  return (
    <RoutesComponent>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route
        path={ROUTES.ABOUT.INTEROPERABILITY}
        element={<Interoperability />}
      />
      <Route path={ROUTES.ABOUT.ACCEPTABLE_USE} element={<AcceptableUse />} />
      <Route path={ROUTES.ABOUT.PRIVACY} element={<Privacy />} />
      <Route path={ROUTES.ABOUT.TERMS} element={<Terms />} />
      <Route path={ROUTES.ABOUT.DISCLAIMER} element={<Disclaimer />} />
      <Route path={ROUTES.ABOUT.COOKIES} element={<Cookies />} />
      <Route path={ROUTES.SUPPORTED_PIDS.ROOT} element={<SupportedPids />} />
      <Route path={ROUTES.SUPPORTED_PIDS.PID_DETAIL} element={<PidDetail />} />
      <Route
        path={ROUTES.MANAGED_PIDS.ROOT}
        element={<ProtectedRoute routeRoles={["provider_admin", "admin"]} />}
      >
        <Route index element={<ManagedPids />} />
      </Route>
      <Route
        path={ROUTES.MANAGED_PIDS.ADD}
        element={<ProtectedRoute routeRoles={["provider_admin", "admin"]} />}
      >
        <Route index element={<AddEditProvider />} />
      </Route>
      <Route
        path={ROUTES.MANAGED_PIDS.VIEW}
        element={<ProtectedRoute routeRoles={["provider_admin", "admin"]} />}
      >
        <Route index element={<AddEditProvider editMode={2} />} />
      </Route>
      <Route
        path={ROUTES.MANAGED_PIDS.EDIT}
        element={<ProtectedRoute routeRoles={["admin", "provider_admin"]} />}
      >
        <Route index element={<AddEditProvider editMode={1} />} />
      </Route>
      <Route
        path={ROUTES.USER_ROLE.ROOT}
        element={<ProtectedRoute routeRoles={[]} />}
      >
        <Route index element={<UserRole />} />
      </Route>
      <Route
        path={ROUTES.USER_ROLE.REQUESTS}
        element={<ProtectedRoute routeRoles={["admin", "provider_admin"]} />}
      >
        <Route index element={<UserRoleRequests />} />
      </Route>
      <Route path={ROUTES.USER_ROLE.GUIDE} element={<UserRoleGuide />} />
      <Route
        path={ROUTES.USER_ROLE.USERS_TABLE}
        element={<ProtectedRoute routeRoles={["admin", "provider_admin"]} />}
      >
        <Route index element={<UsersTable />} />
      </Route>
      <Route path={ROUTES.LOGOUT} element={<KeycloakLogout />} />
      <Route path="*" element={<NotFound />} />
    </RoutesComponent>
  );
};

export default Routes;
