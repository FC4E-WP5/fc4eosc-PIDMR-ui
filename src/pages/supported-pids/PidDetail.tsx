import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHandsHelping,
  FaBarcode,
  FaNotEqual,
  FaCheck,
  FaDna,
} from "react-icons/fa";

import ROUTES from "../../server/endpoints/routes";
import { Provider } from "../../types";
import { Button, Spinner } from "react-bootstrap";
import Icon from "../../common/components/Icon";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const PROVIDER_API_ROUTE = `${PIDMR_API}/v1/providers`;

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
    <div className="pid-detail-container d-flex flex-column flex-grow-1 container">
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
        <div className="row my-5">
          <div className="col-12 mx-auto">
            <strong>{errorMessage}</strong>
          </div>
        </div>
      ) : (
        <div className="row my-5">
          <div className="col-12 mx-auto">
            <h2>
              {" "}
              <Icon
                fileName={getProviderLogo(provider?.type)}
                className="provider-logo"
                width="34px"
                height="34px"
              />{" "}
              <span>{provider?.name}</span>
            </h2>
          </div>
          <div className="col-12 mx-auto">{provider?.description}</div>
          <div className="col-12 mx-auto">
            <p>&nbsp;</p>
          </div>

          <div className="col-12 mx-auto my-3">
            <h4>
              <FaBarcode className="fabackground" /> General Information
            </h4>
            <hr />
            <div>
              <strong>Regex(es): </strong> The main rule PIDMR uses to identify
              the provider
              <span className="regex-display">{provider?.regexes}</span>
            </div>
            <div className="my-2">
              <span>
                {provider?.validator === "NONE" ? (
                  <FaNotEqual className="text-danger me-2" />
                ) : (
                  <FaCheck className="text-success me-2" />
                )}
              </span>
              <strong>Validator:</strong> Sometimes the provider has a validator
              / algorithm that can be used to check if the PID is valid (ex.
              checksum).
            </div>
            <div className="my-2">
              <span>
                {provider?.relies_on_dois ? (
                  <FaCheck className="text-success me-2" />
                ) : (
                  <FaNotEqual className="text-danger me-2" />
                )}
              </span>
              <strong>Relies on DOIs:</strong> Sometimes communities and various
              domains use DOIs for their PIDs (ex. Zenodo). Actually they took
              one or more prefixes only for their PID's.
            </div>
          </div>
          <div className="col-12 mx-auto my-3">
            <h5>
              <FaDna className="fabackground" /> Resolution Modes
            </h5>
            <div>
              {provider?.resolution_modes.map((mode) => (
                <div key={mode.mode}>
                  <span>{mode.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 mx-auto my-3">
            <h4>
              <FaHandsHelping className="fabackground" /> Example
            </h4>
            <hr />
            {provider?.examples && provider.examples?.length > 0 && (
              <div>
                <span>{provider?.examples[0]}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <Link to={ROUTES.SUPPORTED_PIDS.ROOT} className="my-4">
        <Button size="sm" variant="secondary">
          <FaArrowLeft /> Back
        </Button>
      </Link>
    </div>
  );
}

export default PidDetail;
