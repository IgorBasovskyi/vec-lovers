"use client";

import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <div className="flex flex-1 items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong 😢</h1>
      <p>{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
};

export default GlobalError;
