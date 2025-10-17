"use client";

import { useEffect } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { TState } from "@/types/auth/server";

export function useServerFormState<FormValues extends FieldValues>(
  state: TState | null,
  form: UseFormReturn<FormValues>
) {
  useEffect(() => {
    if (!state) return;

    // Handle validation errors
    if (state.type === "validation" && state.fields) {
      Object.entries(state.fields).forEach(([field, message]) => {
        form.setError(field as Path<FormValues>, {
          message: message as string,
        });
      });
    }

    if (state.type === "error" && state.message) {
      form.setError("root", { message: state.message });
    }
  }, [state, form]);
}
