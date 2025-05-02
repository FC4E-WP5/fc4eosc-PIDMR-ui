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

const getProviderLogoName = (type: string): string => {
  const upperType = type?.replace(/\s/g, "").toUpperCase();
  return LOGO_MAPPING[upperType] || LOGO_MAPPING.DEFAULT;
};

export default getProviderLogoName;
