import { TState } from "@/types/auth/server";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useServerRedirect = (state: TState | null) => {
  const router = useRouter();

  useEffect(() => {
    if (state?.type === "success") {
      router.push(state.redirectTo);
    }
  }, [state, router]);
};
