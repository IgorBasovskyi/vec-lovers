import { yupResolver } from "@hookform/resolvers/yup";
import { UseFormProps } from "react-hook-form";
import { AnyObjectSchema, InferType } from "yup";

export const getFormSettings = <TSchema extends AnyObjectSchema>({
  schema,
  defaultValues,
}: {
  schema: TSchema;
  defaultValues: InferType<TSchema>;
}): UseFormProps<InferType<TSchema>> => {
  return {
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  };
};
