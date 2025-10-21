"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";

interface CopyButtonProps {
  svgIcon: string | React.ReactNode;
}

const CopyButton = ({ svgIcon }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof svgIcon === "string") {
      await navigator.clipboard.writeText(svgIcon);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      console.warn("Cannot copy non-string SVG directly");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Copied!</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
