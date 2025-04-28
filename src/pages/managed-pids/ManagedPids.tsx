import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../auth";
import {
  FaCheck,
  FaCog,
  FaEdit,
  FaExclamationTriangle,
  FaGlasses,
  FaIdCard,
  FaList,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { ApiResponse, Provider } from "../../types";
import { Alert, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { DeleteModal } from "../../common/components/DeleteModal";
import toast from "react-hot-toast";
import Icon from "../../common/components/Icon";
import { StatusModal } from "./StatusModal";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const PROVIDERS_ADMIN_API_ROUTE = `${PIDMR_API}/v1/admin/providers`;

interface DeleteModalConfig {
  show: boolean;
  title: string;
  message: string;
  itemId: string;
  itemName: string;
}

interface StatusModalConfig {
  show: boolean;
  itemId: string;
  itemName: string;
  status: string;
}

const tooltipList = <Tooltip id="tooltip">View PID</Tooltip>;
const tooltipEdit = <Tooltip id="tooltip">Edit PID</Tooltip>;
const tooltipDelete = <Tooltip id="tooltip">Delete PID</Tooltip>;
const tooltipAPPROVE = <Tooltip id="tooltip">Change to Approved</Tooltip>;
const tooltipPENDING = <Tooltip id="tooltip">Change to Pending</Tooltip>;

const customStyles = (isScreenSmall = false) => ({
  headCells: {
    style: {
      color: "#202124",
      fontSize: "16px",
      backgroundColor: "#F4F6F8",
      paddingLeft: isScreenSmall ? "6px" : "16px",
      paddingRight: isScreenSmall ? "6px" : "16px",
      paddingTop: isScreenSmall ? "6px" : "12px",
      paddingBottom: isScreenSmall ? "6px" : "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: isScreenSmall ? "6px" : "16px",
      paddingRight: isScreenSmall ? "6px" : "16px",
      paddingTop: isScreenSmall ? "6px" : "12px",
      paddingBottom: isScreenSmall ? "6px" : "12px",
    },
  },
});

// Create a mapping from provider types to their respective logo files
const LOGO_MAPPING: Record<string, string> = {
  ARK: "logoARK.png",
  ARXIV: "logoARXIV.png",
  DOI: "logoDOI.png",
  EPICOLD: "logoEPIC.png",
  "URN:NBN:DE": "logoNBNDE.png",
  "URN:NBN:FI": "logoNBNFI.png",
  "10.5281/ZENODO": "logoZenodo.svg",
  DEFAULT: "logoSWH.png",
};

const getProviderLogo = (type: string): string => {
  const upperType = type.replace(/\s/g, "").toUpperCase();
  return LOGO_MAPPING[upperType] || LOGO_MAPPING.DEFAULT;
};

const SMALL_SCREEN_BREAKPOINT = 991;

const ManagedPids = () => {
  const { roles, userid } = useContext(AuthContext)!;
  const admin = roles.includes("admin");
  const providerAdmin = roles.includes("provider_admin");
  const [data, setData] = useState<Provider[]>([]);
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [searchParams] = useSearchParams();
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { keycloak } = useContext(AuthContext)!;

  const [isScreenSmall, setIsScreenSmall] = useState(
    window.innerWidth < SMALL_SCREEN_BREAKPOINT,
  );

  useEffect(() => {
    const handleResize = () =>
      setIsScreenSmall(window.innerWidth < SMALL_SCREEN_BREAKPOINT);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [deleteModalConfig, setDeleteModalConfig] = useState<DeleteModalConfig>(
    {
      show: false,
      title: "Delete PID Provider",
      message: "Are you sure you want to delete the following PID Provider?",
      itemId: "",
      itemName: "",
    },
  );

  const [statusModalConfig, setStatusModalConfig] = useState<StatusModalConfig>(
    {
      show: false,
      status: "",
      itemId: "",
      itemName: "",
    },
  );

  const handleDeleteOpenModal = (item: Provider) => {
    setDeleteModalConfig({
      ...deleteModalConfig,
      show: true,
      itemId: item.id.toString(),
      itemName: item.name,
    });
  };

  const handleApproveOpenModal = (item: Provider) => {
    setStatusModalConfig({
      ...statusModalConfig,
      show: true,
      status: item.status || "",
      itemId: item.id.toString(),
      itemName: item.name,
    });
  };

  const handleStatusConfirmed = async (id: string, status: string) => {
    if (keycloak) {
      const url = PROVIDERS_ADMIN_API_ROUTE + "/" + id + "/update-status";
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (response.ok) {
          setStatusModalConfig({
            ...statusModalConfig,
            show: false,
            status: "",
            itemId: "",
            itemName: "",
          });
          toast.success("Provider status changed!");
          setTriggerFetch(true);
        } else {
          response.json().then((data) => {
            toast.error(
              <div>
                <strong>{`Error trying to change status for Provider:`}</strong>
                <br />
                <span>{data.message}</span>
              </div>,
            );
          });
        }
      } catch (error: unknown) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteConfirmed = async (id: string) => {
    if (keycloak) {
      const url = PROVIDERS_ADMIN_API_ROUTE + "/" + id;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          setDeleteModalConfig({
            ...deleteModalConfig,
            show: false,
            itemId: "",
            itemName: "",
          });
          toast.success("Provider deleted!");
          setTriggerFetch(true);
        } else {
          response.json().then((data) => {
            toast.error(
              <div>
                <strong>{`Error trying to delete Provider:`}</strong>
                <br />
                <span>{data.message}</span>
              </div>,
            );
          });
        }
      } catch (error: unknown) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let allData: Provider[] = [];
      let page = 1;
      const size = 100;
      let totalPages = 1;

      if (keycloak) {
        try {
          while (page <= totalPages) {
            const response = await fetch(
              `${PROVIDERS_ADMIN_API_ROUTE}?size=${size}&page=${page}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${keycloak.token}`,
                },
              },
            );
            const json: ApiResponse = await response.json();
            allData = allData.concat(json.content);
            totalPages = json.total_pages;
            page += 1;
          }
          setData(allData);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
    setTriggerFetch(false);
  }, [searchParams, triggerFetch, keycloak]);

  const createBadges = (row: Provider) => {
    return (
      <>
        {row.resolution_modes.map((mode) => (
          <span
            className="badge badge-small bg-secondary m-1"
            key={mode.mode}
            style={{ fontSize: "0.7rem" }}
          >
            {mode.name}
          </span>
        ))}
      </>
    );
  };

  const columns: TableColumn<Provider>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <Icon
            fileName={getProviderLogo(row.type)}
            height="28px"
            width="28px"
          />
          <strong>{row.name}</strong>
        </div>
      ),
      wrap: true,
      grow: 2,
      minWidth: "100px",
      maxWidth: "320px",
    },
    ...(!isScreenSmall
      ? [
          {
            name: "Description",
            selector: (row: Provider) => row.description,
            cell: (row: Provider) => {
              const shortDesc =
                row.description.length > 150
                  ? row.description.substring(0, 150) + "..."
                  : row.description;

              return (
                <div className="m-1" title={row.description}>
                  {shortDesc}
                </div>
              );
            },
            wrap: true,
            grow: 2,
            minWidth: "180px",
            maxWidth: "500px",
          },
        ]
      : []),
    {
      name: "Modes",
      cell: (row) => <div>{createBadges(row)}</div>,
      wrap: true,
      grow: 1,
      minWidth: "100px",
      maxWidth: "240px",
    },
    {
      name: "Status",
      selector: (row) => row.status || "",
      cell: (row) => (
        <span style={{ fontSize: "1rem" }}>
          {row.status === "APPROVED" ? (
            <span className="badge bg-success-pidmir">
              <FaCheck /> Approved
            </span>
          ) : (
            <span className="badge bg-primary-pidmir">
              <FaGlasses /> Pending
            </span>
          )}
        </span>
      ),
      conditionalCellStyles: [
        {
          when: () => isScreenSmall,
          style: {
            margin: "auto 16px",
          },
        },
      ],
      sortable: true,
      grow: 1,
      minWidth: "80px",
      maxWidth: "240px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="btn-group">
          <OverlayTrigger placement="top" overlay={tooltipList}>
            <Button
              variant="light"
              size="sm"
              onClick={() =>
                (window.location.href = `/managed-pids/view/${row.id}`)
              }
            >
              <FaList />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={tooltipEdit}>
            <Button
              variant="light"
              size="sm"
              onClick={() =>
                (window.location.href = `/managed-pids/edit/${row.id}`)
              }
            >
              <FaEdit />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={tooltipDelete}>
            <Button
              variant="light"
              size="sm"
              onClick={() => handleDeleteOpenModal(row)}
            >
              <FaTrashAlt />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              row.status === "APPROVED" ? tooltipPENDING : tooltipAPPROVE
            }
          >
            <Button
              variant="light"
              size="sm"
              onClick={() => handleApproveOpenModal(row)}
            >
              {row.status === "APPROVED" ? <FaCog /> : <FaCheck />}
            </Button>
          </OverlayTrigger>
        </div>
      ),
      minWidth: "140px",
    },
  ];

  const filteredData = data.filter((request) => {
    const matchesText =
      (request.name &&
        request.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (request.description &&
        request.description.toLowerCase().includes(filterText.toLowerCase()));

    const matchesType =
      request.status &&
      request.status.toLowerCase().includes(filterStatus.toLowerCase());

    return matchesText && matchesType;
  });

  return (
    <>
      <Alert variant="success" className="mt-2">
        <FaIdCard size="1.6rem" className="me-2" /> You have logged in as{" "}
        <strong>{userid}</strong> having the{" "}
        {roles.length > 1 ? "roles" : "role"} of:{" "}
        <strong>{roles.join(", ")}</strong>
      </Alert>
      <div className="d-flex justify-content-between">
        <div>
          <h5>Managed Pids:</h5>
        </div>
        {(admin || providerAdmin) && (
          <div className="mb-2">
            <Link className="btn-outline-dark btn" to="/managed-pids/add">
              <FaPlusCircle /> Add new PID types
            </Link>
          </div>
        )}
      </div>

      <div className="row mb-3 mt-3">
        <div className="col-4">
          <Form.Select
            id="domainSelection"
            name="formSelectDomain"
            aria-label="Domain Selection"
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="">Select Status</option>
            <option key="approved" value="approved">
              Approved
            </option>
            <option key="pending" value="pending">
              Pending
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

      <div className="mb-5">
        {data && data.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredData}
            defaultSortFieldId={4}
            defaultSortAsc={false}
            theme="default"
            customStyles={customStyles(isScreenSmall)}
            pagination
          />
        ) : (
          <Alert variant="info">
            <div className="d-flex align-items-center">
              <FaExclamationTriangle size={40} />
              <div className="ms-3">
                <strong>No types!</strong>
                <br />
                It seems there are no PID types yet.
              </div>
            </div>
          </Alert>
        )}
      </div>

      <DeleteModal
        show={deleteModalConfig.show}
        title={deleteModalConfig.title}
        message={deleteModalConfig.message}
        itemId={deleteModalConfig.itemId}
        itemName={deleteModalConfig.itemName}
        onHide={() => {
          setDeleteModalConfig({ ...deleteModalConfig, show: false });
        }}
        onDelete={() => {
          handleDeleteConfirmed(deleteModalConfig.itemId);
        }}
      />
      <StatusModal
        show={statusModalConfig.show}
        itemId={statusModalConfig.itemId}
        itemName={statusModalConfig.itemName}
        status={statusModalConfig.status}
        onHide={() => {
          setStatusModalConfig({ ...statusModalConfig, show: false });
        }}
        onAction={() => {
          if (statusModalConfig.status === "APPROVED") {
            handleStatusConfirmed(statusModalConfig.itemId, "PENDING");
          } else {
            handleStatusConfirmed(statusModalConfig.itemId, "APPROVED");
          }
        }}
      />
    </>
  );
};

export default ManagedPids;
