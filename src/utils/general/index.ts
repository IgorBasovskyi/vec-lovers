export const getFormFields = <T extends string>(
  formData: FormData,
  fields: T[]
): Record<T, string> => {
  const result = {} as Record<T, string>;

  fields.forEach((field) => {
    const value = formData.get(field);
    result[field] = value !== null ? String(value) : "";
  });

  return result;
};
