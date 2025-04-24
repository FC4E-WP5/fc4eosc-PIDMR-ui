import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ApiResponse,
  Provider,
  ResolutionMode,
  PaginationProps,
} from "../../types";
import Icon from "../../common/components/Icon";

// API endpoint declared in env variable
const PIDMR_API = import.meta.env.VITE_PIDMR_API;
// TODO: pagination support in case of a large collection of providers - keep it simple for the time being
const PROVIDERS_API_ROUTE = `${PIDMR_API}/v1/providers`;

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

function renderProviderCard(item: Provider) {
  const actions = item.resolution_modes.map(
    (resolutionMode: ResolutionMode) => (
      <span
        className="badge badge-small bg-info text-white mx-1"
        key={resolutionMode.mode}
      >
        {resolutionMode.name}
      </span>
    ),
  );

  return (
    <div className="mb-1" key={item.id}>
      <div className="providers-box-container">
        <Link className="header" to={"/supported-pids/" + item.id}>
          <div className="headerblock">
            <div className="imgblock" aria-hidden="true">
              <Icon
                fileName={getProviderLogo(item.type)}
                height="32px"
                width="32px"
              />
            </div>
            <div className="titlebox">
              <div>
                <span className="title">{item.name}</span>
              </div>
              <div className="typebox">
                <span className="desc"> type: {item.type} </span>
              </div>
            </div>
          </div>
        </Link>
        <div className="descbox">
          <div className="description">
            <span>{item.description}</span>
          </div>
        </div>
        <div className="example-text">
          <span>Example: </span>
          {item.examples[0] && (
            <span className={item.examples[0]} data-example={item.examples[0]}>
              {item.examples[0]}
            </span>
          )}

          <div className="actions-text">
            <span className="mx-1">
              <strong className="text-dark">/</strong> Supported modes:
            </span>
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPaginationControls(props: PaginationProps) {
  const {
    isClientSide,
    currentPage,
    pageSize,
    data,
    totalItems,
    totalPages,
    searchTerm,
  } = props;

  // If no pagination needed, return empty div
  if (isClientSide && totalItems === 0) return <div></div>;
  if (!isClientSide && (!data?.links || data.links.length === 0))
    return <div></div>;

  let start: number, end: number, total: number, maxPage: number;

  if (isClientSide) {
    start = (currentPage - 1) * pageSize;
    end = Math.min(start + pageSize, totalItems);
    total = totalItems;
    maxPage = totalPages;
  } else {
    start = (data!.number_of_page - 1) * pageSize;
    end = start + (data?.content?.length || 0);
    total = data!.total_elements;
    maxPage = data!.total_pages;
  }

  const page = isClientSide ? currentPage : data!.number_of_page;

  return (
    <div className="d-flex justify-content-between">
      <div>
        {(isClientSide ? currentPage > 1 : start > 0) && (
          <>
            <Link
              className="btn btn-primary btn-sm mx-2"
              to={`./?size=${pageSize}&page=1`}
            >
              First
            </Link>
            <Link
              className="btn btn-primary btn-sm mx-2"
              to={`./?size=${pageSize}&page=${page - 1}`}
            >
              ← Prev
            </Link>
          </>
        )}
        <span className="mx-4">
          <strong>{start + 1}</strong> to <strong>{end}</strong> out of{" "}
          <strong>{total}</strong>
          {isClientSide && searchTerm && (
            <span className="ms-2">(filtered results)</span>
          )}
        </span>
        {(isClientSide ? currentPage < totalPages : end < total) && (
          <>
            <Link
              to={`./?size=${pageSize}&page=${page + 1}`}
              className="btn btn-primary btn-sm mx-2"
            >
              Next →
            </Link>
            <Link
              to={`./?size=${pageSize}&page=${maxPage}`}
              className="btn btn-primary btn-sm mx-2"
            >
              Last
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// Component to render a simple info page about supported PIDs
function SupportedPids() {
  // provider data from backend
  const [data, setData] = useState<ApiResponse | null>(null);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // small trigger to refetch data when deleting items
  const [triggerFetch, setTriggerFetch] = useState(true);
  // router urlparams for pagination
  const [searchParams, setSearchParams] = useSearchParams();
  // navigate to change on pagination
  const navigate = useNavigate();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset to first page when searching
    if (searchParams.get("page") !== "1") {
      setSearchParams({
        size: searchParams.get("size") || "20",
        page: "1",
      });
    }
  };

  function handleChangeSize(evt: { target: { value: string } }) {
    // navigate to the same page but with new url parameter for size and go to first page
    navigate("./?size=" + evt.target.value + "&page=1");
  }

  useEffect(() => {
    // parse the page & size url params
    let page = parseInt(searchParams.get("page") || "");
    let size = parseInt(searchParams.get("size") || "");

    // if no page given assume first
    if (!page) {
      page = 1;
    }

    // if no size given or size too big assume 20 and start at first page
    if (!size || size > 100) {
      size = 20;
      page = 1;
    }

    // fetch the data from the api
    const fetchData = async () => {
      try {
        const response = await fetch(
          PROVIDERS_API_ROUTE + "?size=" + size + "&page=" + page,
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    setTriggerFetch(false);
  }, [searchParams, triggerFetch]);

  useEffect(() => {
    const fetchAllProviders = async () => {
      try {
        const response = await fetch(`${PROVIDERS_API_ROUTE}?size=100&page=1`);
        const json = await response.json();
        if (json && json.content) {
          setAllProviders(json.content);
        }
      } catch (error) {
        console.error("Error fetching all providers:", error);
      }
    };

    fetchAllProviders();
  }, [triggerFetch]);

  // Filter and paginate providers based on search term
  const filteredProviders = useMemo(() => {
    if (!allProviders?.length || !searchTerm) return [];
    const lowercaseSearchTerm = searchTerm?.toLowerCase();
    return allProviders.filter((provider) => {
      const { name, description, type, examples } = provider || {};

      return (
        name?.toLowerCase()?.includes(lowercaseSearchTerm) ||
        description?.toLowerCase()?.includes(lowercaseSearchTerm) ||
        examples?.[0]?.toLowerCase()?.includes(lowercaseSearchTerm) ||
        type?.toLowerCase()?.includes(lowercaseSearchTerm)
      );
    });
  }, [allProviders, searchTerm]);

  // Set up pagination for filtered results
  const paginatedProviders = useMemo(() => {
    if (!filteredProviders.length) return [];

    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "20");

    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, filteredProviders.length);

    return filteredProviders.slice(startIndex, endIndex);
  }, [filteredProviders, searchParams]);

  // prepare the list of supported providers
  const providers: React.ReactNode[] = [];

  // prep the page navigation element
  let pageNav = null;
  // prep the element that holds the page next, prev controls
  let pageFlip = <div></div>;

  const pageSize = parseInt(searchParams.get("size") || "20");

  // When search is active, use filtered and paginated data
  const isSearchActive = searchTerm.trim().length > 0;
  const displayProviders = isSearchActive
    ? paginatedProviders
    : data?.content || [];

  const totalFilteredItems = filteredProviders.length;
  const totalFilteredPages = Math.ceil(totalFilteredItems / pageSize);
  const currentPage = parseInt(searchParams.get("page") || "1");

  if (displayProviders.length > 0) {
    providers.push(...displayProviders.map(renderProviderCard));

    pageFlip = renderPaginationControls({
      isClientSide: isSearchActive,
      currentPage,
      pageSize,
      data,
      totalItems: totalFilteredItems,
      totalPages: totalFilteredPages,
      searchTerm,
    });
  } else if (isSearchActive) {
    providers.push(
      <div className="alert p-1 " key="no-results">
        No providers matching your search term "{searchTerm}".
      </div>,
    );
  }

  // here render the page navigation footer
  pageNav = (
    <div className="d-flex justify-content-between">
      {/* This is the optional element to flip between pages */}
      {pageFlip}
      {/* This is the element to select page size */}
      <div>
        <span className="mx-1">results per page: </span>
        <select
          name="per-page"
          value={searchParams.get("size") || "20"}
          id="per-page"
          onChange={handleChangeSize}
        >
          <option value="5">5</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="row my-5">
      <div className="col-md-9 ">
        <div className="input-group mb-3">
          <input
            className="form-control border"
            placeholder="Find the provider you want"
            id="search-input"
            type="search"
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between"></div>
      <div className="mt-3 search-results">{providers}</div>
      {pageNav}
    </div>
  );
}

export default SupportedPids;
