import { useEffect, useState } from "react";
import Icon from "./Icon";

interface ProviderLogoProps {
  imageUrl?: string;
  providerName: string;
  height?: string;
  width?: string;
  className?: string;
}

const PIDMR_API = import.meta.env.VITE_PIDMR_API;

const ProviderLogo = ({
  imageUrl,
  providerName,
  height = "28px",
  width = "28px",
  className = "",
}: ProviderLogoProps) => {
  const [useDefaultIcon, setUseDefaultIcon] = useState(!imageUrl);

  useEffect(() => {
    if (imageUrl) {
      setUseDefaultIcon(false);
    } else {
      setUseDefaultIcon(true);
    }
  }, [imageUrl]);

  // If no custom logo or if there was an error loading it, use the default icon
  if (useDefaultIcon) {
    return (
      <Icon
        fileName="logoPlaceholder.png"
        height={height}
        width={width}
        className={className}
      />
    );
  }

  // Ensure we construct the proper URL based on whether imageUrl is already absolute
  const imgSrc =
    imageUrl?.startsWith("http") || imageUrl?.startsWith("data:image/")
      ? imageUrl
      : `${PIDMR_API}${imageUrl}`;

  return (
    <img
      alt={`${providerName} logo`}
      className={className}
      height={height}
      style={{ objectFit: "contain" }}
      onError={() => {
        // Fall back to default icon if image fails to load
        setUseDefaultIcon(true);
      }}
      src={imgSrc}
      width={width}
    />
  );
};

export default ProviderLogo;
