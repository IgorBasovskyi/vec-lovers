import * as yup from "yup";

export const addIconSchema = yup.object({
  title: yup
    .string()
    .min(1, "Title is required.")
    .max(100, "Title should not contain more than 100 characters.")
    .required("Title is required."),

  description: yup
    .string()
    .max(500, "Description should not contain more than 500 characters.")
    .optional(),

  svgIcon: yup
    .string()
    .min(1, "SVG icon is required.")
    .required("SVG icon is required."),

  category: yup
    .string()
    .max(50, "Category should not contain more than 50 characters.")
    .optional(),
});
