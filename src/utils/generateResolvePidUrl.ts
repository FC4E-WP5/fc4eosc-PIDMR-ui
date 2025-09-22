const PIDMR_API = import.meta.env.VITE_PIDMR_API;
const RESOLVE_API_ROUTE = `${PIDMR_API}/v1/metaresolvers/resolve`;

enum ResolutionModes {
  LandingPage = "landingpage",
  Metadata = "metadata",
  Resource = "resource",
}

const generateResolvePidUrl = (
  resolutionMode: ResolutionModes,
  pid: string,
): string => {
  return `${RESOLVE_API_ROUTE}?pidMode=${resolutionMode}&redirect=true&pid=${encodeURIComponent(
    pid,
  )}`;
};

export default generateResolvePidUrl;
