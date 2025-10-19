"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SvgInputTabs from "../SvgInputTabs";
import SvgPreview from "../SvgPreview";
import { ISvgInputProps } from "@/types/icon/client";

const SvgIconField = ({
  form,
  inputMode,
  onInputModeChange,
  onFileUpload,
}: ISvgInputProps) => {
  return (
    <FormField
      control={form.control}
      name="svgIcon"
      render={({ field }) => (
        <FormItem>
          <FormLabel>SVG Icon</FormLabel>

          <FormControl>
            <div className="space-y-3">
              <SvgInputTabs
                inputMode={inputMode}
                onInputModeChange={onInputModeChange}
                form={form}
                onFileUpload={onFileUpload}
              />

              {field.value && inputMode === "upload" && (
                <SvgPreview svgContent={field.value} />
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SvgIconField;
