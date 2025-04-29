import React, { useState, useEffect, useContext } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaUser, FaShieldAlt, FaRegCheckCircle } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { AuthContext } from "../../auth";
import { UserList } from "../../types";
import AdminLayout from "../../common/components/AdminLayout";

const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const USERS_API_ROUTE = `${PIDMR_API}/v1/admin/users`;

const UsersTable: React.FC = () => {
  const customStyles = {
    headCells: {
      style: {
        color: "#202124",
        fontSize: "16px",
        backgroundColor: "#F4F6F8",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
      },
    },
  };

  const [requests, setRequests] = useState<UserList[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");
  const { keycloak } = useContext(AuthContext)!;

  useEffect(() => {
    const fetchRoleChangeRequests = async () => {
      if (keycloak) {
        try {
          const response = await fetch(USERS_API_ROUTE, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${keycloak.token}`,
            },
          });
          const data = await response.json();
          setRequests(data.content);
          console.log("Data: ", data);
        } catch (error) {
          console.error("Error fetching role change requests:", error);
        }
      }
    };

    fetchRoleChangeRequests();
  }, [keycloak]);

  const idToColor = (id: string) => {
    // generate hash from id
    const hash = Array.from(id).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );

    // define color palette
    const palette = [
      "#ea7286",
      "#eab281",
      "#e3e19f",
      "#a9c484",
      "#5d937b",
      "#58525a",
      "#a07ca7",
      "#f4a4bf",
      "#f5d1b6",
      "#eeede3",
      "#d6cec2",
      "#a2a6a9",
      "#777f8f",
      "#a3b2d2",
      "#bfded8",
      "#bf796d",
    ];

    // select the color
    return palette[hash % palette.length];
  };

  const renderInitialCircle = (id: string) => {
    const color = idToColor(id);
    const style = {
      backgroundColor: color,
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "20px",
      fontWeight: "bold",
    };

    return (
      <div style={style}>
        <FaUser />
      </div>
    );
  };

  const renderRoleBadges = (roles: string[]) => {
    return roles.map((role, index) => {
      const badgeType = role.toLowerCase() === "admin" ? "primary" : "success";
      const badgeLabel = role.toLowerCase() === "admin" ? "Admin" : "Validated";
      const badgeIcon =
        role.toLowerCase() === "admin" ? <FaShieldAlt /> : <FaRegCheckCircle />;
      return (
        <span key={index} className={`badge bg-${badgeType} me-1`}>
          {badgeIcon} {badgeLabel}
        </span>
      );
    });
  };

  const columns: TableColumn<UserList>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => (
        <>
          <div className="m-1">{renderInitialCircle(row.id.toString())}</div>
          <div>
            <div>
              {row.name} {row.surname}{" "}
            </div>
            <div style={{ color: "gray", fontSize: "12px" }}>
              id: {row.id.length > 20 ? row.id.substring(0, 20) + ".." : row.id}
            </div>
          </div>
        </>
      ),
      sortable: true,
      wrap: true,
    },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Roles",
      cell: (row) => renderRoleBadges(row.roles),
      sortable: true,
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesText =
      (request.name &&
        request.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (request.email &&
        request.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (request.id &&
        request.id.toLowerCase().includes(filterText.toLowerCase())) ||
      (request.roles &&
        request.roles
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (request.surname &&
        request.surname.toLowerCase().includes(filterText.toLowerCase()));

    const matchesType = filterType
      ? request.roles.some(
          (role) => role.toLowerCase() === filterType.toLowerCase(),
        )
      : true;

    return matchesText && matchesType;
  });

  return (
    <AdminLayout>
      <div className="mb-4">
        <h5>
          <FaUser className="me-2" />
          Users
        </h5>
        <div className="row mb-3 mt-3">
          <div className="col-4">
            <Form.Select
              id="domainSelection"
              name="formSelectDomain"
              aria-label="Domain Selection"
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="">Select Role</option>
              <option key="admin" value="admin">
                Admin
              </option>
              <option key="provider_admin" value="provider_admin">
                Provider Admin
              </option>
            </Form.Select>
          </div>
          <div className="col-6">
            <Form.Control
              id="searchField"
              name="filterText"
              aria-label="Input for searching the list"
              placeholder="Search ..."
              value={filterText}
              aria-describedby="button-addon2"
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredRequests}
          theme="default"
          customStyles={customStyles}
          pagination
          defaultSortFieldId={1}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersTable;
