"use server";

interface EllipsisWithTooltipProps {
  text: string;
  className?: string;
  widthClass?: string;
}

const EllipsisWithTooltip = ({
  text,
  className = "",
  widthClass = "max-w-[12rem]",
}: EllipsisWithTooltipProps) => (
  <span className={`block truncate ${widthClass} ${className}`} title={text}>
    {text}
  </span>
);

export default EllipsisWithTooltip;
