import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface ErrorPayload {
  data: {
    errors: string[];
  };
}

export const rtkQueryErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as ErrorPayload;
      const errorsArr = payload.data.errors;

      errorsArr.forEach((error) =>
        toast.error("Server Error", {
          description: error,
          action: {
            label: "Close",
            onClick: () => {},
          },
        })
      );
    }

    return next(action);
  };
