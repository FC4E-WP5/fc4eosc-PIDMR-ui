import { useEffect, useState } from "react";

interface IconProps {
  color?: string;
  className?: string;
  fileName: string;
  height?: string;
  isDisabled?: boolean;
  onClick?: () => void;
  width?: string;
}

interface ErrorWithStatus {
  message: string;
}

const Icon = ({
  color,
  className,
  fileName,
  height = "20px",
  isDisabled,
  onClick,
  width = "20px",
}: IconProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Use URL constructor to resolve relative paths
      const imageUrl = new URL(`../../assets/${fileName}`, import.meta.url)
        .href;
      setImageSrc(imageUrl);
    } catch (err: unknown) {
      const error = err as ErrorWithStatus;
      console.error(
        `Failed to load icon ${fileName}. ErrorMessage: ${error?.message}`,
      );
    }
  }, [fileName]);

  const handleClick = () => {
    if (typeof onClick === "function" && !isDisabled) {
      onClick();
    }
  };

  const iconClassName = `icon ${className || ""} ${
    onClick && !isDisabled ? "clickable" : ""
  }`.trim();

  return imageSrc ? (
    <img
      alt={fileName}
      className={iconClassName}
      data-testid={`${fileName}-icon`}
      height={height}
      onClick={handleClick}
      src={imageSrc}
      style={{ backgroundColor: color }}
      width={width}
    />
  ) : (
    <div
      className="icon-placeholder"
      data-testid={`${fileName}-icon-placeholder`}
      style={{ height, width, backgroundColor: "transparent" }}
    />
  );
};

export default Icon;
