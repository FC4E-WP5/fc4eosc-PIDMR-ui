import React from "react";
import AdminSidebar from "./AdminSidebar";
import "./AdminSidebar.css"; // Reusing the same CSS file

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
