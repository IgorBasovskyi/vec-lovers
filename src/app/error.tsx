"use client";

import { CustomButton } from "@/components/ui/custom/button";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong 😢</h1>
      <p>{error.message}</p>
      <CustomButton onClick={() => reset()}>Try again</CustomButton>
    </div>
  );
};

export default GlobalError;
