import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHandsHelping,
  FaBarcode,
  FaNotEqual,
  FaCheck,
  FaDna,
  FaHome,
  FaSourcetree,
} from "react-icons/fa";

import ROUTES from "../../server/endpoints/routes";
import { Provider } from "../../types";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import Icon from "../../common/components/Icon";
import generateResolvePidUrl from "../../utils/generateResolvePidUrl";
import getProviderLogoName from "../../utils/getProviderLogoName";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const PROVIDER_API_ROUTE = `${PIDMR_API}/v1/providers`;

// resolution mode values
enum ResolutionModes {
  LandingPage = "landingpage",
  Metadata = "metadata",
  Resource = "resource",
}

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
                fileName={getProviderLogoName(provider?.type)}
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
                <div key={mode.mode} className="mb-3">
                  <strong>{mode.name}</strong>
                  <div className="ms-2 mt-1">
                    {mode.mode === "landingpage" && (
                      <p>
                        Landing pages are directly accessible and referenced in
                        the PID and provide additional information about the
                        referenced object. This is the first instance of
                        resolving a PID and provides a brief summary of the
                        content of PID including some metadata. The landing page
                        is provided in HTML format and is not machine
                        actionable.
                      </p>
                    )}

                    {mode.mode === "metadata" && (
                      <p>
                        Metadata describes the, with a PID, referenced object
                        and provide detailed specification of the object based
                        on the predefined PID schema and is either included
                        within the PID or can be retrieved using the PID itself.
                        Metadata are usually provided in JSON as well as XML
                        format though other formats like in case of content
                        negotiation for instance could be provided including
                        Bibtex, RDF Turtle and so on. Metadata are machine
                        actionable.
                      </p>
                    )}
                    {mode.mode === "resource" && (
                      <p>
                        The resource is the referenced object accessible either
                        directly or via a landing page. The resource of an
                        object is normally given within the metadata.
                        Accessibility of the resources depends on the service
                        provider. Resources are usually provided in different
                        formats including PDF, Document, HTML and other
                        community specific formats. Machine actionable but not
                        by default.
                      </p>
                    )}
                  </div>
                  {mode?.endpoints &&
                    mode?.endpoints.length > 0 &&
                    mode?.endpoints[0]?.link &&
                    mode?.endpoints[0]?.link.trim() !== "" && (
                      <div>
                        <span>Resolution URL:</span>{" "}
                        <a
                          className="text-decoration-none"
                          href={mode?.endpoints[0]?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {mode?.endpoints[0]?.link}
                        </a>
                      </div>
                    )}
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
                <p className="mb-3">
                  Sample PID: <strong>{provider?.examples[0]}</strong>
                </p>

                {provider?.resolution_modes.some(
                  (mode) =>
                    mode?.endpoints &&
                    mode?.endpoints.length > 0 &&
                    mode?.endpoints[0]?.link,
                ) && (
                  <div className="d-flex align-items-center gap-1">
                    <h6 className="mt-1">Example Resolution URL(s):</h6>
                    {provider?.resolution_modes.map((mode) => {
                      if (!provider.examples[0]) {
                        return null;
                      }

                      const resolvedUrl = generateResolvePidUrl(
                        mode.mode as ResolutionModes,
                        provider.examples[0],
                      );

                      return (
                        <div key={mode.mode} className="mb-1">
                          <div>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>{mode.name}</Tooltip>}
                            >
                              <Button
                                as="a"
                                className="border-0"
                                href={resolvedUrl}
                                rel="noreferrer"
                                size="sm"
                                target="_blank"
                                variant="outline-secondary"
                              >
                                {mode.mode === "landingpage" && (
                                  <FaHome size={28} />
                                )}
                                {mode.mode === "metadata" && (
                                  <FaBarcode size={28} />
                                )}
                                {mode.mode === "resource" && (
                                  <FaSourcetree size={28} />
                                )}
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
