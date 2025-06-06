import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import {
  FaEdit,
  FaInfoCircle,
  FaPlusCircle,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import { AuthContext } from "../../auth";
import { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Endpoint, Provider, ProviderInput } from "../../types";
import { toast } from "react-hot-toast";
import { AddEditProviderInfo } from "./InfoText";
import { useDropzone } from "react-dropzone";
import ProviderLogo from "../../common/components/ProviderLogo";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const PROVIDERS_ADMIN_API_ROUTE = `${PIDMR_API}/v3/admin/providers`;
const PROVIDERS_ADMIN_API_ROUTE_V1 = `${PIDMR_API}/v1/admin/providers`;

function AddEditProvider({ editMode = 0 }: { editMode?: number }) {
  const navigate = useNavigate();
  const params = useParams();

  const { keycloak } = useContext(AuthContext)!;

  const [info, setInfo] = useState<ProviderInput>({
    type: "",
    name: "",
    description: "",
    examples: [""],
    relies_on_dois: false,
    resolution_modes: [],
    regexes: [""],
    resource_path_in_metadata: [
      {
        provider: "",
        path: "",
      },
    ],
    image_base_64: "",
    image_url_path: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleRegexChange = (index: number, value: string) => {
    const updatedInfo = { ...info };
    updatedInfo.regexes[index] = value;
    setInfo(updatedInfo);
  };

  const handleRegexRemove = (index: number) => {
    const updatedInfo = { ...info };
    updatedInfo.regexes.splice(index, 1);
    setInfo(updatedInfo);
  };

  const handleRegexAdd = () => {
    const updatedRegexes = [...info.regexes, ""];
    setInfo({ ...info, regexes: updatedRegexes });
  };

  const handleMetadataPathChange = (
    index: number,
    field: "provider" | "path",
    value: string,
  ) => {
    const updatedInfo = { ...info };
    if (updatedInfo.resource_path_in_metadata) {
      updatedInfo.resource_path_in_metadata[index] = {
        ...updatedInfo.resource_path_in_metadata[index],
        [field]: value,
      };
      setInfo(updatedInfo);
    }
  };

  const handleMetadataPathRemove = (index: number) => {
    const updatedInfo = { ...info };
    if (updatedInfo.resource_path_in_metadata) {
      updatedInfo.resource_path_in_metadata.splice(index, 1);
      setInfo(updatedInfo);
    }
  };

  const handleResourcePath = () => {
    const updatedInfo = { ...info };
    if (updatedInfo.resource_path_in_metadata) {
      updatedInfo.resource_path_in_metadata = [
        ...updatedInfo.resource_path_in_metadata,
        { provider: "", path: "" },
      ];
    } else {
      updatedInfo.resource_path_in_metadata = [{ provider: "", path: "" }];
    }
    setInfo(updatedInfo);
  };

  const handleExampleChange = (index: number, value: string) => {
    const updatedInfo = { ...info };
    updatedInfo.examples[index] = value;
    setInfo(updatedInfo);
  };

  const handleExampleRemove = (index: number) => {
    const updatedInfo = { ...info };
    updatedInfo.examples.splice(index, 1);
    setInfo(updatedInfo);
  };

  const handleExampleAdd = () => {
    const updatedExamples = [...info.examples, ""];
    setInfo({ ...info, examples: updatedExamples });
  };

  useEffect(() => {
    const handleGet = async (id: string) => {
      if (keycloak) {
        try {
          const response = await fetch(
            `${PROVIDERS_ADMIN_API_ROUTE_V1}/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
              },
            },
          );

          if (response.ok) {
            const responseData = (await response.json()) as Provider;

            const loadedInfo = {
              ...responseData,
              resolution_modes: responseData.resolution_modes.map((item) => ({
                name: item.name,
                mode: item.mode,
                endpoints: item.endpoints || [],
              })),
            };
            setInfo(loadedInfo);

            // Set image preview if the provider has an image URL
            if (loadedInfo?.image_url_path) {
              setImagePreview(loadedInfo.image_url_path);
            }
          }
        } catch (error: unknown) {
          toast.error("Error while trying to add new provider!");
          console.error("Error:", error);
        }
      }
    };

    if (editMode && params.id) {
      handleGet(params.id);
    }
  }, [editMode, keycloak, params.id]);

  const handleSubmit = async () => {
    if (keycloak) {
      const sumbittedData = { ...info };

      // Filter out resource_path_in_metadata entries with empty fields
      if (
        sumbittedData.resource_path_in_metadata &&
        sumbittedData.resource_path_in_metadata.length > 0
      ) {
        sumbittedData.resource_path_in_metadata =
          sumbittedData.resource_path_in_metadata.filter(
            (item) => item.provider.trim() !== "" && item.path.trim() !== "",
          );
      }

      const method = editMode ? "PATCH" : "POST";
      const url = editMode
        ? `${PROVIDERS_ADMIN_API_ROUTE}/${params.id}`
        : PROVIDERS_ADMIN_API_ROUTE;
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
          },
          body: JSON.stringify(sumbittedData),
        });

        if (response.ok) {
          navigate("/managed-pids");
          toast.success(
            `Provider ${editMode ? "updated" : "added"} successfully!`,
          );
        } else {
          response.json().then((data) => {
            toast.error(
              <div>
                <strong>{`Error trying to ${
                  editMode ? "update" : "add new"
                } Provider:`}</strong>
                <br />
                <span>{data.message}</span>
              </div>,
            );
          });
        }
      } catch (error: unknown) {
        toast.error("Backend Error while trying to create a new provider");
        console.error("Error:", error);
      }
    }
  };

  const hasResolution = (mode: string) => {
    return info.resolution_modes.some((item) => item.mode === mode);
  };

  const handleCheckBoxChange = (mode: string, checked: boolean) => {
    if (checked) {
      setInfo({
        ...info,
        resolution_modes: [
          ...info.resolution_modes,
          { name: "", mode, endpoints: [{ link: "", provider: "" }] },
        ],
      });
    } else {
      setInfo({
        ...info,
        resolution_modes: info.resolution_modes.filter(
          (item) => item.mode !== mode,
        ),
      });
    }
  };

  const handleReliesOnDoisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({ ...info, relies_on_dois: e.target.checked });
  };

  const handleEndpointChange = (
    mode: string,
    index: number,
    value: Endpoint,
  ) => {
    const updatedModes = info.resolution_modes.map((item) =>
      item.mode === mode
        ? {
            ...item,
            endpoints: item.endpoints.map((ep, i) =>
              i === index ? value : ep,
            ),
          }
        : item,
    );
    setInfo({ ...info, resolution_modes: updatedModes });
  };

  const handleAddEndpoint = (mode: string) => {
    const updatedModes = info.resolution_modes.map((item) =>
      item.mode === mode
        ? {
            ...item,
            endpoints: [...item.endpoints, { link: "", provider: "" }],
          }
        : item,
    );
    setInfo({ ...info, resolution_modes: updatedModes });
  };

  const handleRemoveEndpoint = (mode: string, index: number) => {
    const updatedModes = info.resolution_modes.map((item) => {
      if (item.mode === mode) {
        const newEndpoints = item.endpoints.filter((_, i) => i !== index);
        return { ...item, endpoints: newEndpoints };
      }
      return item;
    });
    setInfo({ ...info, resolution_modes: updatedModes });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.error("Only PNG and JPEG image formats are supported");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = event.target.result as string;
          setInfo({ ...info, image_base_64: base64String });
          setImagePreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    },
    [info],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  const handleRemoveImage = () => {
    setInfo({ ...info, image_base_64: "", image_url_path: "" });
    setImagePreview(null);
  };

  return (
    <div className="mt-4">
      {editMode == 1 ? (
        <h5>
          <FaEdit className="me-2" /> Edit provider{" "}
          <Badge className="ms-2" bg="dark">
            {" "}
            id: {params.id}{" "}
          </Badge>
        </h5>
      ) : editMode == 0 ? (
        <h5>
          <FaPlusCircle className="me-2" />
          Add new Provider
        </h5>
      ) : (
        <h5>
          <FaInfoCircle className="me-2" /> Provider Details{" "}
          <Badge className="ms-2" bg="dark">
            {" "}
            id: {params.id}{" "}
          </Badge>
        </h5>
      )}

      <Form className="mt-4">
        <fieldset disabled={editMode === 2}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formProviderPidType">
              <Form.Label>PID Type</Form.Label>
              <span className="info-icon">
                {" "}
                i
                <span className="info-text">
                  {AddEditProviderInfo.type.info}
                </span>
              </span>
              <Form.Control
                type="text"
                placeholder="Enter PID Type"
                onChange={(e) => setInfo({ ...info, type: e.target.value })}
                value={info.type}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formProviderName">
              <Form.Label>Name</Form.Label>
              <span className="info-icon">
                {" "}
                i
                <span className="info-text">
                  {AddEditProviderInfo.name.info}
                </span>
              </span>
              <Form.Control
                type="text"
                placeholder="Enter PID Name"
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                value={info.name}
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formProviderDescription">
            <Form.Label>Description</Form.Label>
            <span className="info-icon">
              {" "}
              i
              <span className="info-text">
                {AddEditProviderInfo.description.info}
              </span>
            </span>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter a short description"
              onChange={(e) =>
                setInfo({ ...info, description: e.target.value })
              }
              value={info.description}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProviderRegex">
            <Form.Label>Regexes used for identification</Form.Label>
            <span className="info-icon">
              {" "}
              i
              <span className="info-text">
                {AddEditProviderInfo.regexes.info}
              </span>
            </span>
            {info.regexes.map((item, index) => (
              <Row key={`regexes_${index}`} className="mt-1">
                <Col>
                  <Form.Control
                    type="text"
                    name={`formProviderRegex_${index}`}
                    value={item}
                    onChange={(e) => {
                      handleRegexChange(index, e.target.value);
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    className="ms-2"
                    variant="outline-danger"
                    onClick={() => {
                      handleRegexRemove(index);
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              className="d-block mt-1 mb-1"
              variant="outline-success"
              size="sm"
              onClick={handleRegexAdd}
            >
              Add regex
            </Button>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProviderDois">
            <div className="mb-2">
              <span>Select if relies on DOIs</span>
              <span className="info-icon">
                {" "}
                i
                <span className="info-text">
                  {AddEditProviderInfo.relies_on_dois.info}
                </span>
              </span>
            </div>
            <div>
              <Form.Check
                inline
                label="Relies on dois"
                name="formProviderDois"
                type="checkbox"
                id="providerResolveDois"
                checked={info.relies_on_dois}
                onChange={handleReliesOnDoisChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mt-2">
            <div className="mb-2">
              <span>Select resolve modes that this provider supports</span>
              <span className="info-icon">
                {" "}
                i
                <span className="info-text">
                  {AddEditProviderInfo.modes.info}
                </span>
              </span>
            </div>
            {["landingpage", "metadata", "resource"].map((mode) => (
              <div key={mode}>
                <Form.Check
                  type="checkbox"
                  id={`resolution_${mode}`}
                  label={mode}
                  checked={hasResolution(mode)}
                  onChange={(e) => handleCheckBoxChange(mode, e.target.checked)}
                />
                {hasResolution(mode) && (
                  <>
                    {info.resolution_modes
                      .find((item) => item.mode === mode)
                      ?.endpoints.map((endpoint, index) => (
                        <Row key={`${mode}_endpoint_${index}`} className="mt-1">
                          <Col>
                            <Form.Control
                              type="text"
                              value={endpoint.link}
                              placeholder="Enter Link Address (URL)"
                              onChange={(e) =>
                                handleEndpointChange(mode, index, {
                                  ...endpoint,
                                  link: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              value={endpoint.provider}
                              placeholder="Enter Provider Name"
                              onChange={(e) =>
                                handleEndpointChange(mode, index, {
                                  ...endpoint,
                                  provider: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="outline-danger"
                              onClick={() => handleRemoveEndpoint(mode, index)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    <Button
                      variant="outline-success"
                      onClick={() => handleAddEndpoint(mode)}
                      className="mt-1 mb-1"
                      size="sm"
                    >
                      Add endpoint
                    </Button>
                  </>
                )}
              </div>
            ))}
          </Form.Group>

          {((info.resource_path_in_metadata?.length !== 0 && editMode === 2) ||
            editMode !== 2) && (
            <Form.Group
              className="d-flex flex-column mb-3 mt-4"
              controlId="formProviderMetadataPath"
            >
              <div>
                <Form.Label>Resource Path in Metadata</Form.Label>
                <span className="info-icon">
                  {" "}
                  i
                  <span className="info-text">
                    {AddEditProviderInfo.resource_path_in_metadata.info}
                  </span>
                </span>
              </div>

              {info.resource_path_in_metadata &&
                info.resource_path_in_metadata.map((metadataItem, index) => (
                  <Row key={`metadata-${index}`} className="mb-1">
                    <Col>
                      <Form.Control
                        type="text"
                        value={metadataItem.provider}
                        onChange={(e) =>
                          handleMetadataPathChange(
                            index,
                            "provider",
                            e.target.value,
                          )
                        }
                        placeholder="Provider name"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        value={metadataItem.path}
                        onChange={(e) =>
                          handleMetadataPathChange(
                            index,
                            "path",
                            e.target.value,
                          )
                        }
                        placeholder="Path template"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="outline-danger"
                        onClick={() => handleMetadataPathRemove(index)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                ))}
              <Button
                size="sm"
                onClick={handleResourcePath}
                variant="outline-success"
                style={{ width: "fit-content" }}
              >
                Add Resource Path
              </Button>
            </Form.Group>
          )}

          <Form.Group className="mb-3 mt-4" controlId="formProviderLogo">
            <Form.Label>Provider Logo</Form.Label>
            <span className="info-icon">
              {" "}
              i
              <span className="info-text">{AddEditProviderInfo.logo.info}</span>
            </span>
            <div className="mb-3">
              {imagePreview || info.image_url_path || editMode === 2 ? (
                <div className="text-center">
                  <ProviderLogo
                    imageUrl={
                      info.image_url_path ||
                      imagePreview ||
                      (editMode !== 1 && info.type) ||
                      ""
                    }
                    providerType={info.type}
                    providerName={info.name}
                    height="150px"
                    width="auto"
                  />
                </div>
              ) : (
                <div className="dropzone-wrapper" {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the file here...</p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaUpload size={24} className="mb-2 opacity-50" />
                      <span>
                        Drag & drop a logo here, or click to select (PNG/JPEG,
                        Max file size 5MB)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              disabled={!imagePreview && !info.image_url_path}
              variant="outline-danger"
              size="sm"
              onClick={handleRemoveImage}
              className="d-block mx-auto mt-1"
            >
              <FaTrash /> Remove Image
            </Button>
          </Form.Group>

          <Form.Group className="mb-3 mt-4" controlId="formProviderExamples">
            <Form.Label>PID Examples</Form.Label>
            <span className="info-icon">
              {" "}
              i
              <span className="info-text">
                {AddEditProviderInfo.examples.info}
              </span>
            </span>
            {info.examples.map((item, index) => (
              <Row key={`examples_${index}`} className="mt-1">
                <Col>
                  <Form.Control
                    type="text"
                    name={`formProviderExample_${index}`}
                    value={item}
                    onChange={(e) => {
                      handleExampleChange(index, e.target.value);
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    className="ms-2"
                    variant="outline-danger"
                    onClick={() => {
                      handleExampleRemove(index);
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              className="d-block mt-1 mb-1"
              variant="outline-success"
              size="sm"
              onClick={handleExampleAdd}
            >
              Add example
            </Button>
          </Form.Group>
        </fieldset>
        <div className="mb-5 mt-3">
          {editMode !== 2 && (
            <>
              <Button onClick={handleSubmit}>Submit</Button>{" "}
            </>
          )}
          <Link className="btn btn-secondary ms-2" to="/managed-pids">
            {editMode === 2 ? "Back" : "Cancel"}
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default AddEditProvider;
