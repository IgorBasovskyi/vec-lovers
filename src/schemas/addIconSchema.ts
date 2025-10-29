import * as yup from 'yup';
import { ICON_VALIDATION_ERRORS } from '@/constants/icon/client';

export const addIconSchema = yup.object({
  title: yup
    .string()
    .min(1, ICON_VALIDATION_ERRORS.title.minLength)
    .max(100, ICON_VALIDATION_ERRORS.title.maxLength)
    .required(ICON_VALIDATION_ERRORS.title.required),

  description: yup
    .string()
    .max(500, ICON_VALIDATION_ERRORS.description.maxLength)
    .optional(),

  svgIcon: yup
    .string()
    .min(1, ICON_VALIDATION_ERRORS.svgIcon.minLength)
    .required(ICON_VALIDATION_ERRORS.svgIcon.required),

  category: yup
    .string()
    .max(50, ICON_VALIDATION_ERRORS.category.maxLength)
    .optional(),
});
