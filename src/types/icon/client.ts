import { InferType } from "yup";
import { addIconSchema } from "@/schemas/addIconSchema";
import { UseFormReturn } from "react-hook-form";

export type AddIconFormValues = InferType<typeof addIconSchema>;

export type InputMode = "text" | "upload";

export interface FormProps {
  form: UseFormReturn<AddIconFormValues>;
}

export interface AddIconFormProps {
  onSuccess: () => void;
  onSubmit: (submitFn: () => Promise<void>) => void;
  onLoadingChange: (loading: boolean) => void;
}

export interface SvgPreviewProps {
  svgContent: string;
}

export interface ISvgInputProps extends FormProps {
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type TIconFormProps = FormProps;
