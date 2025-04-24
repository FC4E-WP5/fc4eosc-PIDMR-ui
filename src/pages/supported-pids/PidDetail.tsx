import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ROUTES from "../../server/endpoints/routes";
import { Provider } from "../../types";
import { Button, Spinner } from "react-bootstrap";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const PROVIDER_API_ROUTE = `${PIDMR_API}/v1/providers`;

function PidDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${PROVIDER_API_ROUTE}/${id}`);

        if (response.status === 404) {
          const errorData = await response.json();
          setErrorMessage(errorData?.message);
          setProvider(null);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData?.message ||
              `Error ${response.status}: ${response.statusText}`,
          );
          setProvider(null);
          return;
        }

        const data = await response.json();
        setProvider(data);
      } catch (err: unknown) {
        const error = err as Error;
        const errorMessage = error?.message || "An unexpected error occurred";
        console.error(errorMessage);
        setErrorMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  return (
    <div className="pid-detail-container">
      <Link to={ROUTES.SUPPORTED_PIDS.ROOT} className="my-4">
        <Button size="sm" variant="outline-secondary">
          <span className="back-button-text">
            <FaArrowLeft /> Back to Supported PIDs
          </span>
        </Button>
      </Link>
      {loading ? (
        <Spinner
          animation="border"
          className="m-auto my-4"
          role="status"
          variant="primary"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : provider == null ? (
        <strong>{errorMessage}</strong>
      ) : (
        <div className="content">
          <div>
            <span>
              <strong>Name: </strong>
            </span>
            <span>{provider?.name}</span>
          </div>

          <div>
            <span>
              <strong>Type: </strong>
            </span>
            <span>{provider?.type}</span>
          </div>

          <div>
            <span>
              <strong>Description: </strong>
            </span>
            <span>{provider?.description}</span>
          </div>

          {provider?.examples && provider.examples?.length > 0 && (
            <div>
              <span>
                <strong>Example: </strong>
              </span>
              <span>{provider?.examples[0]}</span>
            </div>
          )}

          <div>
            <span>
              <strong>Resolution Modes: </strong>
            </span>
            <div>
              {provider?.resolution_modes.map((mode) => (
                <div key={mode.mode}>
                  <span>{mode.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span>
              <strong>Regexes: </strong>
            </span>
            <span>{provider?.regexes}</span>
          </div>

          <div>
            <span>
              <strong>Relies on DOIs: </strong>
            </span>
            <span>{provider?.relies_on_dois ? "Yes" : "No"}</span>
          </div>

          <div>
            <span>
              <strong>Validator: </strong>
            </span>
            <span style={{ textTransform: "lowercase" }}>
              {provider?.validator}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PidDetail;
