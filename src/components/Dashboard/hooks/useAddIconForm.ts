"use client";

import {
  useActionState,
  useTransition,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { getFormSettings } from "@/utils/yup/client";
import { objectToFormData } from "@/utils/general/client";
import { addIconAction } from "@/actions/icon/add/add";
import { useServerFormState } from "@/hooks/useServerFormState";
import { useToast } from "@/hooks/useToast";
import { TState } from "@/types/general/server";
import { addIconSchema } from "@/schemas/addIconSchema";
import {
  AddIconFormValues,
  InputMode,
  AddIconFormProps,
} from "@/types/icon/client";
import { ADD_ICON_DEFAULT_VALUES } from "@/constants/icon/client";

export const useAddIconForm = ({
  onSuccess,
  onSubmit,
  onLoadingChange,
}: AddIconFormProps) => {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [state, action] = useActionState<TState, FormData>(addIconAction, null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddIconFormValues>(
    getFormSettings({
      schema: addIconSchema,
      defaultValues: ADD_ICON_DEFAULT_VALUES,
    })
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.type !== "image/svg+xml") {
          form.setError("svgIcon", {
            message: "Please upload a valid SVG file",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          form.setValue("svgIcon", content);
          form.clearErrors("svgIcon");
        };
        reader.readAsText(file);
      }
    },
    [form]
  );

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = objectToFormData(form.getValues());
      startTransition(() => action(formData));
    }
  }, [form, action, startTransition]);

  useServerFormState(state, form);
  useToast(state);

  useEffect(() => {
    onSubmit(handleSubmit);
  }, [onSubmit, handleSubmit]);

  useEffect(() => {
    onLoadingChange(isPending);
  }, [isPending, onLoadingChange]);

  useEffect(() => {
    if (state?.type === "success") {
      onSuccess();
      form.reset();
      setInputMode("text");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [state, form, onSuccess]);

  return {
    form,
    inputMode,
    setInputMode,
    handleFileUpload,
    formRef,
    fileInputRef,
  };
};
