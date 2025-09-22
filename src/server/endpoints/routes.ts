const ROUTES = {
  HOME: "/",
  ABOUT: {
    INTEROPERABILITY: "/about/interoperability",
    ACCEPTABLE_USE: "/about/acceptable-use",
    PRIVACY: "/about/privacy",
    TERMS: "/about/terms",
    DISCLAIMER: "/about/disclaimer",
    COOKIES: "/about/cookies",
  },
  SUPPORTED_PIDS: {
    ROOT: "/supported-pids",
    PID_DETAIL: "/supported-pids/:id",
  },
  MANAGED_PIDS: {
    ROOT: "/managed-pids",
    ADD: "/managed-pids/add",
    VIEW: "/managed-pids/view/:id",
    EDIT: "/managed-pids/edit/:id",
  },
  USER_ROLE: {
    ROOT: "/user-role",
    REQUESTS: "/user-role-requests",
    GUIDE: "/user-role-guide",
    USERS_TABLE: "/users-table",
  },
  LOGOUT: "/logout",
};

export default ROUTES;
