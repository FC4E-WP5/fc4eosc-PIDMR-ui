import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { FaBarcode, FaHome, FaSpinner, FaSourcetree } from "react-icons/fa";
import {
  Card,
  Badge,
  Button,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import generateResolvePidUrl from "../../utils/generateResolvePidUrl";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
// Backend references used in resolving stuff
const IDENTIFY_API_ROUTE = `${PIDMR_API}/v2/providers/identify`;
// default debounce input timeout at 300 ms
const DEBOUNCE_TIMEOUT = 300;

// resolution mode values
enum ResolutionModes {
  LandingPage = "landingpage",
  Metadata = "metadata",
  Resource = "resource",
}

// identify status values
enum IdStatus {
  Valid = "VALID",
  Invalid = "INVALID",
  Incomplete = "AMBIGUOUS",
  None = "",
}

// backend identify response schema
type IdResponse = {
  status: IdStatus;
  type: string;
  examples: string[];
  resolution_modes: IdResponseResolutionMode[];
};

type IdResponseResolutionMode = {
  mode: string;
  name: string;
};

// Sorting function based on fixed order
function sortResolutionModes(
  modes: IdResponseResolutionMode[],
): IdResponseResolutionMode[] {
  // Fixed order for resolution modes buttons
  const button_order = ["landingpage", "metadata", "resource"];
  return modes.sort(
    (a, b) => button_order.indexOf(a.mode) - button_order.indexOf(b.mode),
  );
}

// Provide an initial state object for the ui
function initResult(): IdResponse[] {
  return [];
}

function HomePage() {
  const [pid, setPid] = useState("");
  const [results, setResults] = useState(initResult());

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const pid = event.target.value.trim();
    // set pid value
    setPid(pid);
  }

  useEffect(() => {
    // debounce input so the backend is called after a given timeout since user stopped typing
    const debounceProcessInput = setTimeout(async () => {
      if (pid) {
        try {
          // Make a request to your backend API
          const response = await fetch(
            `${IDENTIFY_API_ROUTE}?text=${encodeURIComponent(pid)}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          // Assuming the response is in JSON format
          const data: IdResponse[] = await response.json();
          // Update state with the fetched data
          setResults(data);
        } catch (error) {
          console.log(error);
        } finally {
          console.log("done");
        }
      } else {
        setResults(initResult());
      }
    }, DEBOUNCE_TIMEOUT);

    return () => clearTimeout(debounceProcessInput);
  }, [pid]);

  // when user clicks on a provider example use it as an input value
  function handleGrabEg(event: MouseEvent) {
    const pid = (event.target as HTMLElement).dataset.example;
    setPid(pid || "");
  }

  return (
    <div className="page-center">
      <div className="resolve-panel">
        <h1>🏷️ ➜ 📦</h1>
        <p>
          The FC4EOSC Metaresolver resolves individual handles from various
          providers
        </p>
        <input
          type="text"
          className="form-control"
          id="input-pid"
          value={pid}
          onChange={handleChange}
          autoComplete="off"
        />
        <div className="mt-1">
          {results.length === 0 ? (
            <div className="info">
              <strong>Please enter a valid Pid</strong>
              <br />
              <em>
                supported pids: ark, arXiv, swh, doi, urn:nbn{" "}
                <Link to="/supported-pids"> and more...</Link>
              </em>
            </div>
          ) : results?.length === 1 &&
            results[0]?.status === IdStatus.Invalid ? (
            <div className="no-results">
              <strong>No results available</strong>
            </div>
          ) : (
            results.map((result, index) => (
              <Card className="result-card" key={index}>
                <Card.Body>
                  <div className="result-header">
                    <div className="result-info-container">
                      <span className="type-heading">
                        {result.type || "No type available"}
                      </span>
                      <Badge
                        bg={
                          result.status === IdStatus.Valid
                            ? "success"
                            : "trying text-secondary"
                        }
                        className="status-badge"
                      >
                        {result.status === IdStatus.Valid ? (
                          "Valid"
                        ) : (
                          <FaSpinner size={12} color="orange" />
                        )}
                      </Badge>
                    </div>
                    <div className="result-actions-container">
                      {sortResolutionModes(result.resolution_modes).map(
                        (mode, idx) => (
                          <OverlayTrigger
                            key={idx}
                            placement="bottom"
                            overlay={<Tooltip>{mode.name}</Tooltip>}
                          >
                            <Button
                              as="a"
                              className="border-0"
                              disabled={result.status !== IdStatus.Valid}
                              href={generateResolvePidUrl(
                                mode.mode as ResolutionModes,
                                pid,
                              )}
                              rel="noreferrer"
                              size="sm"
                              target="_blank"
                              variant="outline-secondary"
                            >
                              {mode.mode === "landingpage" && (
                                <FaHome size={18} />
                              )}
                              {mode.mode === "metadata" && (
                                <FaBarcode size={18} />
                              )}
                              {mode.mode === "resource" && (
                                <FaSourcetree size={18} />
                              )}
                            </Button>
                          </OverlayTrigger>
                        ),
                      )}
                    </div>
                  </div>
                  <Row className="mb-1">
                    <div className="example-text">
                      <span>Example: </span>
                      {result?.examples[0] && (
                        <span
                          className={result.examples[0] && "fillin"}
                          data-example={result.examples[0]}
                          onClick={handleGrabEg}
                        >
                          {result.examples[0]}
                        </span>
                      )}
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
        <br />
      </div>
    </div>
  );
}

export default HomePage;
