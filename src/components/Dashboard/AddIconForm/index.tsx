"use client";

import { Form } from "@/components/ui/form";
import { useAddIconForm } from "../hooks/useAddIconForm";
import IconFormFields from "./IconFormFields";
import SvgIconField from "./SvgIconField";
import { AddIconFormProps } from "@/types/icon/client";

const AddIconForm = ({
  onSuccess,
  onSubmit,
  onLoadingChange,
}: AddIconFormProps) => {
  const { form, inputMode, setInputMode, handleFileUpload, formRef } =
    useAddIconForm({
      onSuccess,
      onSubmit,
      onLoadingChange,
    });

  return (
    <Form {...form}>
      <form ref={formRef} className="flex flex-col gap-4">
        <IconFormFields form={form} />

        <SvgIconField
          form={form}
          inputMode={inputMode}
          onInputModeChange={setInputMode}
          onFileUpload={handleFileUpload}
        />
      </form>
    </Form>
  );
};

export default AddIconForm;
