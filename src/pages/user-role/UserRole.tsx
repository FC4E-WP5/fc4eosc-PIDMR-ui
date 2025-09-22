import { Button, Col, Form, Row, Alert, Spinner } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../auth";
import { RoleChangeRequest } from "../../types";
import { PromotionRequestInfo } from "../managed-pids/InfoText";
import AdminLayout from "../../common/components/AdminLayout";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const USER_ROLE_REQUEST_API_ROUTE = `${PIDMR_API}/v1/users/role-change-request`;

function UserRole() {
  const navigate = useNavigate();
  const { keycloak } = useContext(AuthContext)!;
  const { userid } = useContext(AuthContext)!;

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "provider_admin",
    description: "",
  });
  const [pendingRequest, setPendingRequest] =
    useState<RoleChangeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { name, surname, email, role, description } = formData;
    if (!name || !surname || !email || !role || !description) {
      toast.error("All fields are required.");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (keycloak) {
      try {
        const response = await fetch(USER_ROLE_REQUEST_API_ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setShowThankYou(true);
          toast.success("Role promotion request submitted successfully!");

          setTimeout(checkPendingRequest, 3000); // Check for pending requests after a delay
        } else {
          const errorData = await response.json();
          toast.error(
            <div>
              <strong>Error submitting request:</strong>
              <br />
              <span>{errorData.message}</span>
            </div>,
          );
        }
      } catch (error: unknown) {
        toast.error("Backend Error while trying to submit the request");
        console.error("Error:", error);
      }
    }
  };

  const checkPendingRequest = useCallback(async () => {
    if (keycloak) {
      try {
        const response = await fetch(USER_ROLE_REQUEST_API_ROUTE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        if (response.ok) {
          const requestData = await response.json();
          const userRequests = requestData.content;

          if (Array.isArray(userRequests)) {
            const userRequest = userRequests.find(
              (element: RoleChangeRequest) => element.user_id === userid,
            );
            if (userRequest) {
              setPendingRequest(userRequest);
            } else {
              setPendingRequest(null);
            }
          } else {
            setPendingRequest(null);
          }
        } else {
          setPendingRequest(null);
        }
      } catch (error: unknown) {
        console.error("Error:", error);
        setPendingRequest(null);
      }
    }
    setLoading(false);
  }, [keycloak, userid]);

  useEffect(() => {
    checkPendingRequest();
  }, [checkPendingRequest]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (pendingRequest) {
    return (
      <AdminLayout>
        <div className="mt-4">
          <h5>
            <FaPlusCircle className="me-2" />
            Role Promotion Request
          </h5>
          <Alert className="mt-4" variant="info">
            <span>
              You have already submitted a request with status:
              <strong> {pendingRequest.status} </strong>
            </span>
            <br />
            {pendingRequest.status === "REJECTED" ? (
              <div>
                Please contact the following email{" "}
                <strong>pidmr@einfra.grnet.gr</strong> for more information!
              </div>
            ) : (
              ""
            )}
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mt-4">
        <h5>
          <FaPlusCircle className="me-2" />
          Request Role Promotion
        </h5>
        {showThankYou ? (
          <Alert variant="success">
            Thank you for submitting your role promotion request!
          </Alert>
        ) : (
          <Form className="mt-4">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formUserName">
                <Form.Label>
                  {PromotionRequestInfo.name.label}
                  <span className="info-icon">
                    {" "}
                    i
                    <span className="info-text">
                      {PromotionRequestInfo.name.info}
                    </span>
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleInputChange}
                  value={formData.name}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formUserSurname">
                <Form.Label>
                  {PromotionRequestInfo.surname.label}
                  <span className="info-icon">
                    {" "}
                    i
                    <span className="info-text">
                      {PromotionRequestInfo.surname.info}
                    </span>
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder="Enter your surname"
                  onChange={handleInputChange}
                  value={formData.surname}
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formUserEmail">
              <Form.Label>
                {PromotionRequestInfo.email.label}
                <span className="info-icon">
                  {" "}
                  i
                  <span className="info-text">
                    {PromotionRequestInfo.email.info}
                  </span>
                </span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserRole">
              <Form.Control
                hidden
                name="role"
                onChange={handleInputChange}
                value={formData.role}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserDescription">
              <Form.Label>
                {PromotionRequestInfo.description.label}
                <span className="info-icon">
                  {" "}
                  i
                  <span className="info-text">
                    {PromotionRequestInfo.description.info}
                  </span>
                </span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter a short description"
                onChange={handleInputChange}
                value={formData.description}
              />
            </Form.Group>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/logout")}
            >
              Cancel
            </Button>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
}

export default UserRole;
