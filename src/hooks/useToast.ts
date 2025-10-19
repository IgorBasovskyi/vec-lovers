import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TState } from "@/types/general/server";
import { toast } from "sonner";

type ToastType = "success" | "error" | "validation";

const toastMap: Record<
  ToastType,
  { title: string; style: "success" | "error" | "info" }
> = {
  success: { title: "Success", style: "success" },
  error: { title: "Server Error", style: "error" },
  validation: { title: "Validation Error", style: "error" },
};

const showToast = (type: ToastType, message: string) => {
  const { title, style } = toastMap[type];
  toast[style](title, {
    description: message,
    action: { label: "Close", onClick: () => {} },
  });
};

export const useToast = (state: TState | null) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryHandledRef = useRef(false);

  useEffect(() => {
    if (state?.type && state?.message) {
      showToast(state.type, state.message);
    }

    const type = searchParams.get("type");
    const message = searchParams.get("message");

    if (type === "success" && message && !queryHandledRef.current) {
      queryHandledRef.current = true;
      showToast("success", message);

      const url = new URL(window.location.href);
      url.searchParams.delete("type");
      url.searchParams.delete("message");
      router.replace(url.toString());
    }
  }, [state, searchParams, router]);
};
