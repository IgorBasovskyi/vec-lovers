"use client";

import Image from "next/image";
import { SvgPreviewProps } from "@/types/icon/client";

const SvgPreview = ({ svgContent }: SvgPreviewProps) => {
  if (!svgContent) return null;

  return (
    <div className="p-3 bg-muted rounded-md w-full flex items-center gap-3">
      <p className="text-sm text-muted-foreground">SVG preview:</p>
      <Image
        src={URL.createObjectURL(
          new Blob([svgContent], { type: "image/svg+xml" })
        )}
        alt="SVG preview"
        className="w-6 h-6"
        unoptimized
        width={100}
        height={100}
      />
    </div>
  );
};

export default SvgPreview;
