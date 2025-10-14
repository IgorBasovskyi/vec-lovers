import { TState } from "@/types/auth/server";
import { useEffect } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "validation";

interface ToastConfig {
  title: string;
  style: "success" | "error" | "info";
}

const toastMap: Record<ToastType, ToastConfig> = {
  success: {
    title: "Success",
    style: "success",
  },
  error: {
    title: "Server Error",
    style: "error",
  },
  validation: {
    title: "Validation Error",
    style: "error",
  },
};

const showToast = (type: ToastType, message: string) => {
  const { title, style } = toastMap[type];

  toast[style](title, {
    description: message,
    action: {
      label: "Close",
      onClick: () => {},
    },
  });
};

export const useToast = (state: TState | null) => {
  useEffect(() => {
    if (!state) return;

    const { type, message } = state;

    if (!type || !message) return;

    if (type === "success" || type === "error" || type === "validation") {
      showToast(type, message);
    }
  }, [state]);
};
